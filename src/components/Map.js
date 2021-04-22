/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from 'react'
//Packages
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
//Functions
import { getIntersections, createGeoJSON, createLineLayer } from '../functions/Geometry'

mapboxgl.accessToken =
  'pk.eyJ1IjoiemVreSIsImEiOiJja25tdGdiMnQwN3ZqMm5sYWh2dHU0bjRtIn0.DQ355eGSSydRc9WWwMD2SA'

const Map = () => {
  const mapContainerRef = useRef(null)
  const [length, setLength] = useState(3)
  const [allow, setAllow] = useState(true)

  const [lng, setLng] = useState(32)
  const [lat, setLat] = useState(40)
  const [zoom, setZoom] = useState(5)

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [32, 40],
      zoom: zoom
    })

    let draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: !allow,
        trash: !allow
      },
      //defaultMode: 'draw_polygon'
    })

    //call the function that outputs the results when the polygon is drawn
    map.on('draw.create', () => getResults())

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(draw)

    // A geojson object consisting of two parallel lines
    map.on('load', function () {
      //coordinations
      let initialCoord = [
        [[lng, lat], [lng+length, lat]],
        [[lng, lat-3], [lng+length, lat-3]]
      ]
      //data in the from of geojson
      let data = createGeoJSON('', 'MultiLineString', initialCoord)
      map.addSource('route', {
        'type': 'geojson',
        'data': data
      })
      //create layer
      let layerObj = createLineLayer('route-layer', 'route', 'black', 5)
      map.addLayer(layerObj)
    })
    //

    // The object moves as you click arround if it is allowed
    map.on('click', e => {
      let newLng = e.lngLat.lng
      let newLat = e.lngLat.lat
      let newCoord = [
        [[newLng, newLat], [newLng+length, newLat]],
        [[newLng, newLat-3], [newLng+length, newLat-3]]
      ]
      let data = createGeoJSON('', 'MultiLineString', newCoord)
      if(allow){
        map.getSource('route').setData(data)
        setLng(newLng)
        setLat(newLat)
      }
    })
    //

    //output the filtered lines and add a layer to show them on the map
    const getResults = () => {
      let source = map.getSource('route')
      let multiLineArr = source._data.geometry.coordinates
      let polyArr = draw.getAll().features[0].geometry.coordinates
      let coordArr = getIntersections(multiLineArr, polyArr)
      let geoJSONresults = createGeoJSON('filtered lines','MultiLineString', coordArr)
      console.log('filtered lines: ', geoJSONresults)
      map.addSource('ints', {
        'type': 'geojson',
        'data': geoJSONresults
      })
      let filteredLinesLayer = createLineLayer('filtered-lines-layer', 'ints', 'red', 5)
      map.addLayer(filteredLinesLayer)
    }
    //

    // Clean up on unmount
    return () => map.remove()
  }, [allow, length]) //

  //
  const handleLength = (event, newLength) => setLength(newLength)
  //

  //
  const allowMove = (event) => setAllow(!allow)
  //

  //Render the Map
  return (
    <div>
      <div id='slider-container'>
        <Typography id="continuous-slider" gutterBottom>
          Length [longitude] |
          <span>{` ${length}`}</span>
        </Typography>
        <Slider aria-labelledby="continuous-slider" value={length} onChange={handleLength} max={10}/>
      </div>
      <div className='sidebarStyle'>
        <span>Disable move to be able to draw a polygon</span>
        <span id='allow-button-span'>
          <button onClick={allowMove}>move {` | ${allow ? 'on' : 'off'}`}</button>
        </span>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  )
}

export default Map