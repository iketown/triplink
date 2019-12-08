import React, { useState, useEffect } from "react";
import GooglePlacesAC from "../../Forms/googleAC/GooglePlacesAC";
import { LocBasicType, LocationType } from "../../Locations/location.types";
import LocationDisplay from "../../Locations/LocationDisplay";
import { Button, LinearProgress, IconButton } from "@material-ui/core";
import styled from "styled-components";
import {
  getShortNameFromLoc,
  getTimeZoneFromLatLng
} from "../../../utils/locationFxns";
import moment from "moment-timezone";
import { Cancel } from "@material-ui/icons";
import AirportAC from "../../Travels/AirportACDownshift";
//
//

const FieldAndButton = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

interface IEventLocInput {
  location?: LocBasicType;
  setLocation?: (loc: any) => void;
  locCategory?: "airport";
  label?: string;
}

const EventLocInput = ({
  location,
  setLocation,
  locCategory,
  label
}: IEventLocInput) => {
  const [savedLoc, setSavedLoc] = useState(location);
  const [submitting, setSubmitting] = useState(false);
  const removeSaved = () => {
    setSavedLoc(undefined);
  };
  useEffect(() => {
    if (location) {
      setSavedLoc(location);
    }
  }, [location]);
  const handleChange = async (loc: LocationType) => {
    if (!loc.shortName) {
      loc.shortName = getShortNameFromLoc(loc);
    }
    if (!loc.timeZoneId) {
      loc.timeZoneId = await getTimeZoneFromLatLng({
        lat: loc.lat,
        lng: loc.lng,
        timeStamp: Number(moment().format("X"))
      });
    }
    setSubmitting(false);
    setLocation && setLocation(loc);
  };
  return (
    <>
      {submitting && <LinearProgress />}
      {savedLoc ? (
        <LocationDisplay onChange={removeSaved} location={savedLoc} />
      ) : (
        <FieldAndButton>
          {locCategory === "airport" ? (
            <AirportAC label={label || "airport"} onSelect={handleChange} />
          ) : (
            <GooglePlacesAC {...{ setLocation: handleChange, setSubmitting }} />
          )}
          {location && (
            <IconButton size="small" onClick={() => setSavedLoc(location)}>
              <Cancel />
            </IconButton>
          )}
        </FieldAndButton>
      )}
    </>
  );
};

export default EventLocInput;
