import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@material-ui/core";
import { HelpTwoTone } from "@material-ui/icons";

const EventTypeSelect = ({
  value,
  handleChange
}: {
  value?: string;
  handleChange: (value: any) => void;
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="event-type-picker-label">Event Type</InputLabel>
      <Select
        labelId="event-type-picker-label"
        id="event-type-picker"
        value={value || ""}
        onChange={e => handleChange(e.target.value)}
      >
        <MenuItem value={""}>Choose Event Type</MenuItem>
        <MenuItem value={"generic"}>Generic</MenuItem>
        <MenuItem value={"show"}>Show</MenuItem>
        <MenuItem value={"travel"}>Travel</MenuItem>
        <MenuItem value={"hotel"}>Hotel</MenuItem>
      </Select>
      <FormHelperText>{helperText(value)}</FormHelperText>
    </FormControl>
  );
};

const helperText = (eventType?: string) => {
  switch (eventType) {
    case "generic":
      return "Load in, sound check, dinner, etc";
    case "show":
      return "Live Performance";
    case "travel":
      return "Flight, Ground, etc";
    case "hotel":
      return "Hotel Stay";
    default:
      return "";
  }
};

export default EventTypeSelect;
