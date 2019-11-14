import React from 'react'
import { Marker, MarkerProps } from '@react-google-maps/api'

// info -> https://sites.google.com/site/gmapsdevelopment/

type ColorString =
  | 'yellow'
  | 'yellow-dot'
  | 'blue'
  | 'blue-dot'
  | 'green'
  | 'green-dot'
  | 'lightblue'
  | 'ltblue-dot'
  | 'orange'
  | 'orange-dot'
  | 'pink'
  | 'pink-dot'
  | 'purple'
  | 'purple-dot'
  | 'red'
  | 'red-dot'

const markerColorUrl = (color: ColorString) =>
  `http://maps.google.com/mapfiles/ms/micons/${color}.png`

interface FlexMarkerProps extends MarkerProps {
  color?: ColorString
}

export const FlexMarker = ({
  color = 'blue-dot',
  ...markerProps
}: FlexMarkerProps) => {
  return <Marker {...markerProps} icon={markerColorUrl(color)} />
}

export default FlexMarker
