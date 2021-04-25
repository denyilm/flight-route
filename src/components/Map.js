/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from 'react'
//Packages
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
//Functions
import { getIntersections, createGeoJSON, createLineLayer, createFeatureCollection, getResults, add3DTerrain } from '../functions/Geometry'
import ControlBar from './ControlBar'
import Route from './Route'

mapboxgl.accessToken =
  'pk.eyJ1IjoiemVreSIsImEiOiJja25tdGdiMnQwN3ZqMm5sYWh2dHU0bjRtIn0.DQ355eGSSydRc9WWwMD2SA'

const Map = (props) => {
  const mapContainerRef = useRef(null)
  const [canDraw, setCanDraw] = useState(false)

  const [pickedRoute, setPickedRoute] = useState({})
  const [length, setLength] = useState(0)
  const [width, setWidth] = useState(0)
  const [modifiedPickedRoute, setModifiedPickedRoute] = useState({})
  const [sourceId, setSourceId] = useState('')

  const [lng, setLng] = useState(32)
  const [lat, setLat] = useState(40)
  const [swLng, setSwLng] = useState()
  const [swLat, setSwLat] = useState()
  const [neLng, setNeLng] = useState()
  const [neLat, setNeLat] = useState()
  const [zoom, setZoom] = useState(4)

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoom
    })

    let draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: canDraw,
        trash: canDraw
      },
      //defaultMode: 'draw_polygon'
    })

    if(Object.keys(props.route).length > 0){
      setPickedRoute(props.route)
      let newLng = props.route.geometry.coordinates[0][0][0]
      let newLat = props.route.geometry.coordinates[0][0][1]

      //get length and width with a function instead
      setLength(props.length)
      setWidth(props.width)

      map.setCenter([newLng, newLat])
      setLng(newLng)
      setLat(newLat)
      setSourceId(`route-${props.route.id}`)
    }

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(3))
      setLat(map.getCenter().lat.toFixed(3))
      setZoom(map.getZoom().toFixed(2))
      setSwLng(map.getBounds()._sw.lng.toFixed(3))
      setSwLat(map.getBounds()._sw.lat.toFixed(3))
      setNeLng(map.getBounds()._ne.lng.toFixed(3))
      setNeLat(map.getBounds()._ne.lat.toFixed(3))
    })

    //call the function that outputs the results when the polygon is drawn
    map.on('draw.create', () => getResults(map, sourceId, draw))

    //3D Terrain
    //https://docs.mapbox.com/mapbox-gl-js/example/add-terrain/
    add3DTerrain(map)
    //3D Terrain ends

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(draw)

    // A geojson object consisting of two parallel lines
    map.on('load', function () {
      setSwLng(map.getBounds()._sw.lng.toFixed(4))
      setSwLat(map.getBounds()._sw.lat.toFixed(4))
      setNeLng(map.getBounds()._ne.lng.toFixed(4))
      setNeLat(map.getBounds()._ne.lat.toFixed(4))
      //setCenterInitially
      if(props.data.length > 0 && Object.keys(props.route).length === 0){
        let newLng = props.data[0].geometry.coordinates[0][0][0]
        let newLat = props.data[0].geometry.coordinates[0][0][1]
        map.setCenter([newLng, newLat])
        setLng(newLng)
        setLat(newLat)
      }

      //add the sources draw the layers
      props.data.forEach(feature => {
        map.addSource(`route-${feature.id}`, {
          'type': 'geojson',
          'data': feature
        })
        let layerObj
        if(props.route && props.route.id === feature.id){
          layerObj = createLineLayer(`layer-${feature.id}`, `route-${feature.id}`, 'yellow', 5)
        } else {
          layerObj = createLineLayer(`layer-${feature.id}`, `route-${feature.id}`, 'magenta', 5)
        }
        map.addLayer(layerObj)
        let popup

        map.on('mouseenter', `layer-${feature.id}`, e => {
          map.getCanvas().style.cursor = 'pointer'
          popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].layer.source)
            .addTo(map)
        })

        map.on('mouseleave', `layer-${feature.id}`, function () {
          map.getCanvas().style.cursor = ''
          popup.remove()
        })
      })

      //Update the length of the picked route
      if(Object.keys(props.route).length > 0){
        let pickedRoute_edited = map.getSource(sourceId)._data
        let oldLng = pickedRoute_edited.geometry.coordinates[0][0][0]
        let oldLat = pickedRoute_edited.geometry.coordinates[0][0][1]
        //console.log(length)
        let newCoord = [
          [[oldLng, oldLat], [oldLng+length, oldLat]],
          [[oldLng, oldLat+width], [oldLng+length, oldLat+width]]
        ]
        let data = createGeoJSON('', 'MultiLineString', newCoord)
        map.getSource(sourceId).setData(data)
        pickedRoute_edited =  map.getSource(sourceId)._data
        pickedRoute_edited.id = pickedRoute.id
        //console.log(pickedRoute_edited)
        setModifiedPickedRoute(pickedRoute_edited)
      }
    })
    //

    // The object moves as you click arround
    map.on('click', e => {
      let newLng = Number(e.lngLat.lng.toFixed(3))
      let newLat = Number(e.lngLat.lat.toFixed(3))
      //console.log(routeId)
      if(Object.keys(pickedRoute).length > 0 && !canDraw){
        let newCoord = [
          [[newLng, newLat], [newLng+length, newLat]],
          [[newLng, newLat+width], [newLng+length, newLat+width]]
        ]
        let data = createGeoJSON('', 'MultiLineString', newCoord)
        let routeId = `route-${pickedRoute.id}`
        //console.log(map.getSource(routeId))
        map.getSource(routeId).setData(data)
        let pickedRoute_edited =  map.getSource(routeId)._data
        pickedRoute_edited.id = pickedRoute.id
        //console.log(pickedRoute_edited)
        setModifiedPickedRoute(pickedRoute_edited)
      }
    })
    //

    // Clean up on unmount
    return () => map.remove()
  }, [canDraw, props.data, pickedRoute, length, width]) //

  //
  const handleDrawSwitch = (event) => setCanDraw(!canDraw)

  //Render the Map
  return (
    <div id='map-page-container'>
      <div className="sidebar-map">
        <span>SW: {swLng} | {swLat}</span>
        <span>NE: {neLng} | {neLat}</span>
        <span>C : {lng} | {lat}</span>
      </div>
      <div className='map-container' ref={mapContainerRef} />
      <ControlBar
        handleSave={props.handleSave(modifiedPickedRoute)}
        modified={modifiedPickedRoute}
        handleEmpty={props.handleEmpty}
        pickedRoute={props.route}
        handleDrawSwitch={handleDrawSwitch}
        canDraw={canDraw}
        length={props.length}
        handleLength={props.handleLength}
        width={props.width}
        handleWidth={props.handleWidth}
      />
    </div>
  )
}

export default Map