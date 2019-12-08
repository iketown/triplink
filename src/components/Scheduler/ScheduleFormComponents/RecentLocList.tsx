import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  ListSubheader
} from "@material-ui/core";
import { eventTypes } from "../eventFormHelpers";
import EventLocInput from "./EventLocInput";
import { useTimeRangeEvents } from "../../Events/useEvents";
import moment from "moment";
import { LocBasicType } from "../../Locations/location.types";
import { useFormCtx } from "./FormCtx";
//
//

const RecentLocList = ({ onChooseLoc }: { onChooseLoc?: () => void }) => {
  const { data, handleFieldChange } = useFormCtx();
  const targetDate = data.startDate;
  const dayBefore = moment(targetDate)
    .subtract(2, "day")
    .format();
  const dayAfter = moment(targetDate)
    .add(2, "day")
    .format();
  const { events } = useTimeRangeEvents(dayBefore, dayAfter);

  return (
    <List dense>
      <EventLocInput
        setLocation={loc => {
          handleFieldChange("startLoc", loc);
          handleFieldChange("startLocId", loc.placeId);
          onChooseLoc && onChooseLoc();
        }}
        location={data.startLoc}
      />
      <ListSubheader>Recent Locations:</ListSubheader>
      {events &&
        events.length &&
        events.map(({ startLoc, eventType }, i, arr) => {
          // remove duplicates
          if (
            arr.findIndex(ev => ev.startLoc.placeId === startLoc.placeId) !== i
          )
            return null;
          const { Icon } = eventTypes[eventType];
          const selected = data.startLocId === startLoc.placeId;
          const handleClick = () => {
            handleFieldChange("startLoc", startLoc);
            handleFieldChange("startLocId", startLoc.placeId);
            onChooseLoc && onChooseLoc();
          };
          return (
            <ListItem
              key={startLoc.placeId || i}
              selected={selected}
              button
              dense
              onClick={handleClick}
            >
              {/* //@ts-ignore */}
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={startLoc.shortName}
                secondary={startLoc.venueName}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>
          );
        })}
    </List>
  );
};

export default RecentLocList;
