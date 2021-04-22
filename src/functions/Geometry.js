/* eslint-disable no-unused-vars */
import { point, line, polygon } from '@flatten-js/core'

//
export const pointToArray = (point) => {
  return [point.x, point.y]
}
//

//
export const pointArraysToLines = (pointArr) => {
  let multiLineArr = []
  let lineArr = []
  pointArr.forEach(point => {
    lineArr.push(pointToArray(point))
    if(lineArr.length === 2){
      multiLineArr.push(lineArr)
      lineArr = []
    }
  })
  return multiLineArr
}
//

//
export const getIntersections = (multiLineArr, polyArr) => {
  let line1 = multiLineArr[0]
  let geoLine1 = line(point(line1[0]),point(line1[1]))
  let line2 = multiLineArr[1]
  let geoLine2 = line(point(line2[0]),point(line2[1]))
  let geoPoly = polygon(polyArr)
  let intArr =[]
  let int1 = geoLine1.intersect(geoPoly)
  int1.forEach(point => intArr.push(point))
  let int2 = geoLine2.intersect(geoPoly)
  int2.forEach(point => intArr.push(point))
  return pointArraysToLines(intArr)
}
//

//
export const createGeoJSON = (name, geoType, coordArr) => {
  //source: https://geojson.org/
  let geoJSON = {
    'type': 'Feature',
    'geometry': {
      'type': geoType,
      'coordinates': coordArr
    }
  }
  return geoJSON
}
//

//
export const createLineLayer = (id, source, color, width) => {
  let layerObj = {
    'id': id,
    'type': 'line',
    'source': source,
    'layout': {},
    'paint': {
      'line-color': color,
      'line-width': width
    }
  }
  return layerObj
}