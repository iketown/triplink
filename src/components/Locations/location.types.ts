import { AirportResult } from "../../apis/amadeus.types";

export type LocationType = {
  placeId: string;
  lat: number;
  lng: number;
  address: string;
  venueName: string;
  shortName: string;
  timeZoneId?: string;
  city?: string;
  town?: string;
  state?: string;
  stateShort?: string;
  country?: string;
  countryShort?: string;
  id?: string;
  airports?: AirportResult[];
  locType?: string;
  iataCode?: string;
};

export type LocBasicType = {
  placeId: string;
  venueName: string;
  shortName: string;
  lat: number;
  lng: number;
  address: string;
  timeZoneId?: string;
  id?: string;
  airport?: AirportResult;
  locType?: string;
  iataCode?: string;
};

export interface LocPoint {
  lat: number;
  lng: number;
}
