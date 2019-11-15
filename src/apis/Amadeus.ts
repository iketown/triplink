//@ts-ignore
import Amadeus from "amadeus";
import { useCallback } from "react";
import { debounce } from "lodash";
import { AirportResult, AirportSearchResult } from "./amadeus.types";
import { fakeToAirports } from "../components/Travels/fakeInfo";

const amadeus = new Amadeus({
  clientId: process.env.REACT_APP_AMADEUS_KEY,
  clientSecret: process.env.REACT_APP_AMADEUS_SECRET
});

export const useAmadeus = () => {
  const getAirportsNearPoint = useCallback(
    async (latitude: number, longitude: number) => {
      if (!latitude || !longitude) return null;
      const response: AirportSearchResult = await amadeus.referenceData.locations.airports
        .get({
          latitude,
          longitude
        })
        .catch((err: any) => console.log("amadeus ERROR", err));
      if (!response) return null;
      return response.data;
    },
    []
  );

  const getAirportsByKeyword = useCallback(async (keyword: string) => {
    debounce(() => {});
    if (keyword === "fake") return fakeToAirports;
    const response: AirportSearchResult = await amadeus.referenceData.locations
      .get({ keyword, subType: "AIRPORT" })
      .catch((err: any) => console.log("amadeus ERROR", err));
    if (response) return response.data;
  }, []);

  return { getAirportsNearPoint, getAirportsByKeyword };
};
