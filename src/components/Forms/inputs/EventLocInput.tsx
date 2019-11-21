import React, { useState } from "react";
import moment from "moment-timezone";
import { LocationType } from "../../Locations/location.types";
import {
  getShortNameFromLoc,
  getTimeZoneFromLatLng
} from "../../../utils/locationFxns";
import { useField, Field } from "react-final-form";
import GoogPlacesAC from "../googleAC/GooglePlacesAC";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from "@material-ui/core";
//
//
const EventLocInput = ({ location }: { location?: LocationType }) => {
  console.log("event loc input locatino", location);
  const [editing, setEditing] = useState(!location);
  const { input: startTimeInput } = useField("startTime");
  const { input: startDateInput } = useField("startDate");
  const locContent = <AddressDisplay location={location} />;
  const editingContent = (
    <Field name="location">
      {({ input }) => {
        const handleChange = async (loc: LocationType) => {
          loc.shortName = getShortNameFromLoc(loc);
          const timeZoneId = await getTimeZoneFromLatLng({
            lat: loc.lat,
            lng: loc.lng,
            timeStamp: Number(moment(startDateInput.value).format("X"))
          });
          loc.timeZoneId = timeZoneId;
          moment.tz.setDefault(timeZoneId);
          const formStartTime = moment
            .tz(startDateInput.value, timeZoneId)
            .startOf("day")
            .add(20, "hours")
            .format();
          startTimeInput.onChange(formStartTime);
          setEditing(false);
          input.onChange(loc);
        };
        return (
          <div style={{ marginBottom: "10px" }}>
            <GoogPlacesAC setLocation={handleChange} />
          </div>
        );
      }}
    </Field>
  );

  return (
    <CardContent style={{ display: "flex", justifyContent: "space-between" }}>
      {editing ? editingContent : locContent}
      <Button onClick={() => setEditing(old => !old)}>
        {editing ? "cancel" : "change"}
      </Button>
    </CardContent>
  );
};

export default EventLocInput;

const AddressDisplay = ({ location }: { location?: LocationType }) => {
  if (!location) return null;
  const { venueName, shortName, address } = location;
  return (
    <Grid container justify="space-between">
      <Grid item>
        <Typography variant="h6">{venueName}</Typography>
        <Typography variant="subtitle2">{shortName}</Typography>
        <Typography variant="caption">{address}</Typography>
      </Grid>
    </Grid>
  );
};
