import React, { useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@material-ui/core";
import { Field } from "react-final-form";
import { LocBasicType } from "../Locations/location.types";
import { AirportResult } from "../../apis/amadeus.types";
import AirportAC from "./AirportACDownshift";
//
//
export const DestinationAirportsPicker = ({
  locations,
  arriving,
  closeAirports
}: {
  locations: LocBasicType[];
  arriving?: boolean;
  closeAirports?: (AirportResult | undefined)[];
}) => {
  return (
    <Field name={arriving ? "toAirport" : "fromAirport"}>
      {({ input, meta }) => {
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AirportAC
                onSelect={ap => input.onChange(ap)}
                closeAirports={closeAirports || []}
                arriving={arriving}
                meta={meta}
              />
            </Grid>
          </Grid>
        );
      }}
    </Field>
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
