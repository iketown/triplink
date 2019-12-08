import React, { useMemo, useEffect, useState, useRef } from "react";
import { throttle } from "lodash";
import { PlaceType } from "../Forms/googleAC/GooglePlacesAC";
import { geocodeByPlaceId } from "react-places-autocomplete";
//
//
export const useGoogleAirport = () => {
  const [options, setOptions] = useState<PlaceType[]>([]);

  const searchPlacesService = useRef();

  const fetch = useMemo(
    () =>
      throttle((input: any, callback: any) => {
        (searchPlacesService.current as any).nearbySearch(input, callback);
      }, 200),
    [searchPlacesService.current]
  );

  if (!searchPlacesService.current && (window as any).google) {
    console.log("creating placesservice");
    searchPlacesService.current = new (window as any).google.maps.places.PlacesService();
  }

  const searchAirport = (iataCode: string, lat: number, lng: number) => {
    // first search firebase
    fetch(
      {
        input: iataCode,
        location: { lat, lng },
        radius: 5000,
        type: "airport"
      },
      (results?: PlaceType[]) => {
        console.log("raw results", results);
        setOptions(results || []);
        return results;
      }
    );
  };
  return { searchAirport, options };
};
