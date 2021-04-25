/* eslint-disable no-unused-vars */
import React from 'react'
import Switch from '@material-ui/core/Switch'
import { Slider } from '@material-ui/core'
import _ from 'lodash'

const ControlBar = (props) => {
  return (
    <div id='main-control-bar-container'>
      <span id='add-lines-header'>{ Object.keys(props.pickedRoute).length > 0
        ? `route-${props.pickedRoute.id}`
        : 'Select a route'}</span>
      <div id='info-controls-wrapper'>
        <div id='control-bar-route-info-container'>
          <div id='control-bar-original-router-container'>
            {
              Object.keys(props.pickedRoute).length === 0
                ? null
                :
                <div className='control-bar-route-properties-container'>
                  <span className='control-bar-mini-header'>Original route properties</span>
                  <span>{`origin: [ ${props.pickedRoute.geometry.coordinates[0][0][0]} , ${props.pickedRoute.geometry.coordinates[0][0][1]} ] `}</span>
                  <span>{`length: ${Math.round(props.pickedRoute.geometry.coordinates[0][1][0] - props.pickedRoute.geometry.coordinates[0][0][0])} 
                  | width: ${Math.round(props.pickedRoute.geometry.coordinates[1][0][1] - props.pickedRoute.geometry.coordinates[0][0][1])}`}</span>
                </div>
            }
          </div>
          <div id='control-bar-modified-route-container' >
            {
              Object.keys(props.modified).length === 0 || Object.keys(props.pickedRoute).length === 0
                ? null
                :
                <div className='control-bar-route-properties-container' style={{ backgroundColor: _.isEqual(props.modified, props.pickedRoute) ? 'lightgreen' : 'lightsalmon' }}>
                  <span className='control-bar-mini-header'>Modified route properties</span>
                  <span>{`origin: [ ${props.modified.geometry.coordinates[0][0][0]} , ${props.modified.geometry.coordinates[0][0][1]} ] `}</span>
                  <span>{`length: ${Math.round(props.modified.geometry.coordinates[0][1][0] - props.modified.geometry.coordinates[0][0][0])} 
                  | width: ${Math.round(props.modified.geometry.coordinates[1][0][1] - props.modified.geometry.coordinates[0][0][1])}`}</span>
                </div>
            }
          </div>
        </div>
        { Object.keys(props.pickedRoute).length > 0
          ?
          <div id='controls-container'>
            <div className='slider-container'>
              <span className='slider-tag' >length</span>
              <Slider value={props.length} step={1} marks  onChange={props.handleLength} max={10}></Slider>
              <span className='slider-value'>{Math.round(props.length)}</span>
            </div>
            <div className='slider-container'>
              <span className='slider-tag'>width</span>
              <Slider value={props.width} step={1} marks onChange={props.handleWidth} max={10}></Slider>
              <span className='slider-value'>{Math.round(props.width)}</span>
            </div>
            <div className='slider-container'>
              <span>draw</span>
              <Switch color='default' onChange={props.handleDrawSwitch} checked={props.canDraw}/>
              <span>{props.canDraw ? 'on' : 'off'}</span>
            </div>
          </div>
          :
          null
        }
      </div>
      <div id='control-bar-buttons-container'>
        {
          _.isEqual(props.modified, props.pickedRoute) || Object.keys(props.pickedRoute).length === 0
            ?
            null
            :
            <button className='route-button' onClick={ Object.keys(props.modified).length > 0 &&  !_.isEqual(props.modified, props.pickedRoute) ? props.handleSave : () => console.log('no change')}>save</button>
        }
        {
          Object.keys(props.pickedRoute).length === 0
            ?
            null
            :
            <button className='route-button' onClick={props.handleEmpty}>empty</button>
        }
      </div>
    </div>
  )
}

export default ControlBar