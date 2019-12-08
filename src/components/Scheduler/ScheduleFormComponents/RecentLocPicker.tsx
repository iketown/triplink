import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography
} from "@material-ui/core";
import EventLocInput from "./EventLocInput";
import { useTimeRangeEvents } from "../../Events/useEvents";
import moment from "moment";
import { LocBasicType } from "../../Locations/location.types";
//
//
interface IRecentLocPicker {
  onSelectLoc: (loc?: LocBasicType) => void;
  onSelectId: (id: string) => void;
  locId?: string;
  loc?: LocBasicType;
  targetDate: any;
}
const RecentLocPicker = ({
  onSelectLoc,
  onSelectId,
  loc,
  locId,
  targetDate
}: IRecentLocPicker) => {
  const [showGoogAC, setShowGoogAC] = useState(false);
  const dayBefore = moment(targetDate)
    .subtract(2, "day")
    .format();
  const dayAfter = moment(targetDate)
    .add(2, "day")
    .format();
  const { events } = useTimeRangeEvents(dayBefore, dayAfter);

  const handleChange = (e: any) => {
    const placeId = e.target.value;
    if (placeId === "other") {
      // open goog ac
      onSelectLoc(undefined);
      onSelectId(placeId);
      setShowGoogAC(true);
    } else {
      const event = events.find(event => event.startLoc.placeId === placeId);
      event && onSelectLoc(event.startLoc);
      event && onSelectId(placeId);
      setShowGoogAC(false);
    }
  };
  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">Location</FormLabel>
        <RadioGroup
          aria-label="locations"
          name="gender1"
          value={locId || (loc && loc.placeId)}
          onChange={handleChange}
        >
          <FormControlLabel
            value={"other"}
            control={<Radio />}
            label={
              showGoogAC ? (
                <EventLocInput
                  setLocation={loc => {
                    onSelectLoc(loc);
                    onSelectId(loc.placeId);
                  }}
                  location={locId === "other" ? loc : undefined}
                />
              ) : (
                "Other"
              )
            }
          />
          {events &&
            events.length &&
            events.map((event, i, arr) => {
              // remove duplicates
              if (
                arr.findIndex(
                  ev => ev.startLoc.placeId === event.startLoc.placeId
                ) !== i
              )
                return null;
              return (
                <FormControlLabel
                  key={event.id}
                  value={event.startLoc.placeId}
                  control={<Radio />}
                  label={event.startLoc.venueName}
                />
              );
            })}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default RecentLocPicker;
