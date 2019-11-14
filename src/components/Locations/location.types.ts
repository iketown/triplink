export type LocationType = {
  placeId: string
  lat: number
  lng: number
  address: string
  timeZoneId?: string
  venueName: string
  city?: string
  town?: string
  state?: string
  stateShort?: string
  country?: string
  countryShort?: string
  id?: string
}

export type LocBasicType = {
  placeId: string
  venueName: string
  locShortName: string
  lat: number
  lng: number
  address: string
  id?: string
}

export interface LocPoint {
  lat: number
  lng: number
}
