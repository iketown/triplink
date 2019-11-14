import { LocationType } from '../components/Locations/location.types'

export const getShortNameFromLoc = (loc: LocationType) => {
  let shortName
  if (loc.countryShort && loc.countryShort === 'US') {
    shortName = `${loc.city}, ${loc.stateShort}`
  } else {
    shortName = `${loc.city || loc.town} ${loc.state && loc.state} ${
      loc.country
    }`
  }
  return shortName
}

export const getTimeZoneFromLatLng = async ({
  lat,
  lng,
  timeStamp
}: {
  lat: number
  lng: number
  timeStamp: number
}): Promise<string> => {
  const { REACT_APP_GOOGLE_MAP_API_KEY } = process.env
  const { timeZoneId } = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timeStamp}&key=${REACT_APP_GOOGLE_MAP_API_KEY}`
  ).then(res => res.json())
  console.log('timezone timeZoneId', timeZoneId)
  return timeZoneId
}
