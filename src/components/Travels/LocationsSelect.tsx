import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText
} from "@material-ui/core";
import { LocBasicType } from "../Locations/location.types";
interface ILocationsRadio {
  value: any;
  handleChange: (event: React.ChangeEvent<{ value: string }>) => void;
  label: string;
  locations: LocBasicType[];
  arriving?: boolean;
}
const LocationsSelect = ({
  value,
  handleChange,
  label,
  locations,
  arriving
}: ILocationsRadio) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={value}
        //@ts-ignore
        onChange={handleChange}
      >
        <MenuItem dense value="enterAirport">
          enter Airport
        </MenuItem>
        <MenuItem dense value="multiple">
          <ListItemText
            primary="Multiple"
            secondary={`multiple ${
              arriving ? "arrival" : "departure"
            } airports`}
          />
        </MenuItem>
        {locations.map((loc, index) => {
          return (
            <MenuItem key={loc.placeId} dense value={loc.placeId}>
              <ListItemText primary={loc.shortName} secondary={loc.venueName} />
            </MenuItem>
          );
        })}
      </Select>
      {/* <FormHelperText>Some important helper text</FormHelperText> */}
    </FormControl>
  );
};

export default LocationsSelect;
