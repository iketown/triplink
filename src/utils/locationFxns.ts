import { LocationType } from '../components/Events/EventDialog'

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
