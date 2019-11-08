import React, { useState, useEffect } from 'react'
import { withProps, compose } from 'recompose'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs
} from 'react-google-maps'
import { LocationType } from '../Events/EventDialog'

const { REACT_APP_GOOGLE_MAP_API_KEY } = process.env

export const MapOneLoc = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${REACT_APP_GOOGLE_MAP_API_KEY}&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
  // @ts-ignore
)(({ location }: { location: LocationType }) => {
  // @ts-ignore
  console.log('location', location)
  const [center, setCenter] = useState({ lat: 38.6270025, lng: -90.1994042 })
  useEffect(() => {
    if (location) {
      setCenter(location)
    }
  }, [location])
  return (
    <GoogleMap
      defaultZoom={location ? 8 : 4}
      zoom={location ? 6 : 4}
      defaultCenter={center}
      center={center}
    >
      {location && <Marker position={location} />}
    </GoogleMap>
  )
})

export default MapOneLoc
