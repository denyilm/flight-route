/* eslint-disable no-unused-vars */
import React from 'react'
import Switch from '@material-ui/core/Switch'
import { Slider } from '@material-ui/core'

const ControlBar = (props) => {
  return (
    <div id='main-control-bar-container'>
      <span id='add-lines-header'>Control Panel</span>
      <div id='info-controls-wrapper'>
        <div id='control-bar-route-info-container'>
          <span>{ Object.keys(props.pickedRoute).length > 0 ? `route-${props.pickedRoute.id}` : 'Select a route'}</span>
          <span></span>
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
        <button className='route-button' onClick={ Object.keys(props.modified).length > 0 ? props.handleSave : () => console.log('no change')}>save</button>
        <button className='route-button' onClick={props.handleEmpty}>empty</button>
      </div>
    </div>
  )
}

export default ControlBar