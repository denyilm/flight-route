/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Map from './components/Map'
import axios from 'axios'
import AddLines from './components/AddLines'
import { createGeoJSON } from './functions/Geometry'
import Routes from './components/Routes'
import ControlBar from './components/ControlBar'

const App = () => {
  const [data, setData] = useState([])
  const [lng, setLng] = useState('')
  const [lat, setLat] = useState('')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [pickedRoute, setPickedRoute] = useState({})
  const [slided, setSlided] = useState(false)

  const handleLngChange = (event) => setLng(Number(event.target.value))
  const handleLatChange = (event) => setLat(Number(event.target.value))
  const handleLengthChange = (event) => setLength(Number(event.target.value))
  const handleWidthChange = (event) => setWidth(Number(event.target.value))
  const [latestId, setLatestId] = useState(null)

  //
  const handleSubmit = (event) => {
    event.preventDefault()
    let coordArr = [
      [[lng, lat],[lng+length,lat]],
      [[lng, lat+width],[lng+length,lat+width]]
    ]
    let geoJSON = createGeoJSON('', 'MultiLineString', coordArr)
    axios
      .post('http://localhost:3001/features', geoJSON)
      .then(res => setLatestId(res.data.id))
    setLng('')
    setLat('')
    setLength('')
    setWidth('')
  }
  //

  //
  useEffect(() => {
    axios
      .get('http://localhost:3001/features')
      .then(res => {
        let l = res.data.length
        if(l > 0){
          setLatestId(res.data[l-1].id)
        }
        setData(res.data)
        setSlided(false)
      })
  },[latestId, pickedRoute, slided])
  //

  //
  const handleDelete = (route) => (event) => {
    event.preventDefault()
    axios
      .delete(`http://localhost:3001/features/${route.id}`, route)
      .then(res => {
        setLatestId(route.id-1)
        setPickedRoute({})
      })
  }
  //

  //
  const handleSelect = (route) => (event) => {
    //console.log(route)
    setPickedRoute(route)
    //get length and width with a function instead
    let length = route.geometry.coordinates[0][1][0] - route.geometry.coordinates[0][0][0]
    let width = route.geometry.coordinates[1][0][1] - route.geometry.coordinates[0][0][1]
    setLength(length)
    setWidth(width)
  }
  //

  //
  const handleSave = (route) => (event) => {
    axios
      .put(`http://localhost:3001/features/${route.id}`, route)
      .then(res => setPickedRoute(route))
  }
  //

  //
  const handleEmpty = (event) => {
    event.preventDefault()
    setPickedRoute({})
    setWidth('')
    setLength('')
  }
  //

  //
  const handleLength = (event, newLength) =>
  {
    setSlided(true)
    setLength(newLength)
  }
  //

  //
  const handleWidth = (event, newWidth) =>
  {
    setSlided(true)
    setWidth(newWidth)
  }
  //

  return (
    <div className="main-page-container">
      <div id='map-form-routes-container'>
        <Map
          data={data}
          route={pickedRoute}
          handleSave={handleSave}
          handleEmpty={handleEmpty}
          handleLength={handleLength}
          length={length}
          handleWidth={handleWidth}
          width={width}
        />
        <div id='app-form-routes-container'>
          <AddLines
            handleSubmit={handleSubmit}
            lng={lng}
            handleLngChange={handleLngChange}
            lat={lat}
            handleLatChange={handleLatChange}
            length={length}
            handleLengthChange={handleLengthChange}
            width={width}
            handleWidthChange={handleWidthChange}/>
          <Routes data={data} handleSelect={handleSelect} handleDelete={handleDelete} pickedRoute={pickedRoute}/>
        </div>
      </div>
    </div>
  )
}

export default App
