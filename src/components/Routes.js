/* eslint-disable no-unused-vars */
import React from 'react'
import Route from './Route'

const Routes = (props) => {
  return (
    <div id='main-routes-container'>
      <span id='add-lines-header'>Routes</span>
      {
        props.data.map( feature =>
          <Route key={feature.id} route={feature} routeId={`route-${feature.id}`} handleSelect={props.handleSelect} handleDelete={props.handleDelete} pickedRoute={props.pickedRoute}/>)
      }
    </div>
  )
}

export default Routes