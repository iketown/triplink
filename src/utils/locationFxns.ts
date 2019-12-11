import { LocationType } from "../components/Locations/location.types";
import moment from "moment";
import { AirportResult } from "../apis/amadeus.types";
import React, { useState } from "react";
import usAirports from "../constants/usAirports";
//
//
export const getShortNameFromLoc = (loc: LocationType) => {
  let shortName;
  if (loc.countryShort && loc.countryShort === "US") {
    shortName = `${loc.city}, ${loc.stateShort}`;
  } else {
    shortName = `${loc.city || loc.town} ${loc.state && loc.state} ${
      loc.country
    }`;
  }
  return shortName;
};

export const getTimeZoneFromLatLng = async ({
  lat,
  lng,
  timeStamp
}: {
  lat: number | string;
  lng: number | string;
  timeStamp: number | string;
}): Promise<string> => {
  const { REACT_APP_GOOGLE_MAP_API_KEY } = process.env;
  const { timeZoneId } = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timeStamp}&key=${REACT_APP_GOOGLE_MAP_API_KEY}`
  ).then(res => res.json());
  console.log("timezone timeZoneId", timeZoneId);
  return timeZoneId;
};

export const airportResultToLoc = async (ap: any) => {
  if (ap.locType) return ap;
  const { cityName, stateCode, countryCode, countryName } = ap.address;
  const { latitude, longitude } = ap.geoCode;
  const timeZoneId = await getTimeZoneFromLatLng({
    lat: latitude,
    lng: longitude,
    timeStamp: moment().format("X")
  });
  return {
    locType: "airport",
    address: `${cityName} ${stateCode} ${countryCode}`,
    city: cityName,
    state: countryName,
    country: countryName,
    countryShort: countryCode,
    lat: latitude,
    lng: longitude,
    shortName: `${cityName} ${stateCode} ${countryCode}`,
    venueName: `${ap.iataCode} airport`,
    iataCode: ap.iataCode,
    placeId: ap.iataCode,
    timeZoneId
  };
};

export const useUSAirports = () => {
  const [localResults, setLocalResults] = useState<AirportResult[]>([]);

  const getLocalResults = (searchString?: string) => {
    // get exact match airports "BOS" "MSP"
    if (searchString) {
      const codes: string[] = [];
      const searchStringLow = searchString.toLowerCase();
      //@ts-ignore
      const exactMatch = usAirports.airports[searchString.toUpperCase()];
      if (exactMatch) codes.push(exactMatch.iataCode);
      // get cities
      Object.entries(usAirports.cities).forEach(([city, code]) => {
        if (city.includes(searchStringLow)) {
          //@ts-ignore
          codes.push(code);
        }
      });
      // get states
      Object.entries(usAirports.states).forEach(([state, apCodes]) => {
        if (state.includes(searchStringLow)) {
          //@ts-ignore
          codes.concat(apCodes);
        }
      });
      Object.entries(usAirports.names).forEach(([name, code]) => {
        if (name.includes(searchStringLow)) {
          //@ts-ignore
          codes.push(code);
        }
      });
      const filteredCodes = codes.filter(
        (code, i) => codes.findIndex(_code => _code === code) === i
      );
      setLocalResults(
        //@ts-ignore
        filteredCodes.map(code => usAirports.airports[code])
      );
      return !!filteredCodes.length;
    } else return true;
  };
  return { getLocalResults, localResults };
};
