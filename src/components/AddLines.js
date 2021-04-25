/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import axios from 'axios'
import { createGeoJSON } from '../functions/Geometry'

/*
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "MultiLineString",
              "coordinates": [
                [[32,43],[35,43]],
                [[32,40],[35,40]]
              ]
            }
          }
*/

const AddLines = (props) => {

  return (
    <div id='add-lines-main-container'>
      <span id='add-lines-header'>Add a New Route</span>
      <form id='add-lines-form' onSubmit={props.handleSubmit}>
        <div className='add-line-input-wrapper'>
        longitude <input value={props.lng} onChange={props.handleLngChange} type='number' min='-180' max='180'/>
        </div>
        <div className='add-line-input-wrapper'>
        latitude <input value={props.lat} onChange={props.handleLatChange} type='number' min='-90' max='90'/>
        </div>
        <div className='add-line-input-wrapper'>
        length [lng] <input value={props.length} onChange={props.handleLengthChange} type='number' min='1' max='10'/>
        </div>
        <div className='add-line-input-wrapper'>
        width [lat] <input value={props.width} onChange={props.handleWidthChange} type='number' min='1' max='5'/>
        </div>
        <button type='submit'>add</button>
      </form>
    </div>
  )
}

export default AddLines

