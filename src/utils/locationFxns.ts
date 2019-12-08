import { LocationType } from "../components/Locations/location.types";
import moment from "moment";
import { AirportResult } from "../apis/amadeus.types";

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
  const { cityName, stateCode, countryCode } = ap.address;
  const { latitude, longitude } = ap.geoCode;
  const timeZoneId = await getTimeZoneFromLatLng({
    lat: latitude,
    lng: longitude,
    timeStamp: moment().format("X")
  });
  return {
    locType: "airport",
    address: `${cityName} ${stateCode} ${countryCode}`,
    lat: latitude,
    lng: longitude,
    shortName: `${cityName} ${stateCode} ${countryCode}`,
    venueName: `${ap.iataCode} airport`,
    iataCode: ap.iataCode,
    placeId: ap.iataCode,
    timeZoneId
  };
};
