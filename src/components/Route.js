/* eslint-disable no-unused-vars */
import React from 'react'

const Route = (props) => {

  let lng = props.route.geometry.coordinates[0][0][0]
  let lat = props.route.geometry.coordinates[0][0][1]
  let length = props.route.geometry.coordinates[0][1][0] - props.route.geometry.coordinates[0][0][0]
  let width = props.route.geometry.coordinates[1][0][1] - props.route.geometry.coordinates[0][0][1]

  let style = { backgroundColor : props.route.id === props.pickedRoute.id ? 'lightyellow' : 'rgb(255, 181, 255)' }

  return(
    <div className='route-container' style={style}>
      <span>{props.routeId}</span>
      <div className='route-properties-container'>
        <span>{`origin: [ ${lng} , ${lat} ] `}</span>
        <span>{`length: ${Math.round(length)} | width: ${Math.round(width)}`}</span>
      </div>
      <div className='route-buttons-container'>
        <button className='route-button' onClick={props.handleSelect(props.route)}>select</button>
        <button className='route-button' onClick={props.handleDelete(props.route)}>delete</button>
      </div>
    </div>
  )
}

export default Route