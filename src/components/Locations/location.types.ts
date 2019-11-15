import { AirportResult } from "../../apis/amadeus.types";

export type LocationType = {
  placeId: string;
  lat: number;
  lng: number;
  address: string;
  timeZoneId?: string;
  venueName: string;
  shortName: string;
  city?: string;
  town?: string;
  state?: string;
  stateShort?: string;
  country?: string;
  countryShort?: string;
  id?: string;
  airports?: AirportResult[];
};

export type LocBasicType = {
  placeId: string;
  venueName: string;
  shortName: string;
  lat: number;
  lng: number;
  address: string;
  id?: string;
  airport?: AirportResult;
};

export interface LocPoint {
  lat: number;
  lng: number;
}
