import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@material-ui/core";
import { LocPoint, LocBasicType } from "../Locations/location.types";
import { useEvents } from "../Events/useEvents";
import { fakeFromAirports, fakeToAirports } from "./fakeInfo";
import { useAmadeus } from "../../apis/Amadeus";
import { AirportResult } from "../../apis/amadeus.types";
import ShowMe from "../../utils/ShowMe";
import LocationsSelect from "./LocationsSelect";
import AirportAC from "./AirportACDownshift";
//
//
export const DestinationAirportsPicker = ({
  locations,
  arriving
}: {
  locations: LocBasicType[];
  arriving?: boolean;
}) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <AirportAC
          onSelect={ap => console.log("ap", ap)}
          initialSearchString="las vegas"
        />
      </Grid>
      <ShowMe obj={selectedPlaceId} name="selectedPlaceId" noModal />
    </Grid>
  );
};

export default DestinationAirportsPicker;

const TravelTypePicker = ({
  handleChange,
  value = "airport"
}: {
  handleChange: any;
  value: string;
}) => {
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={value}
        onChange={handleChange}
      >
        <MenuItem value={"airport"}>Airport</MenuItem>
        <MenuItem value={"train"}>Train Station</MenuItem>
      </Select>
      <FormHelperText>Choose Type of travel</FormHelperText>
    </FormControl>
  );
};
