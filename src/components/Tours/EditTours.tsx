import React, { useMemo, useState, useEffect } from "react";
import moment from "moment";
import { useTimeRangeEvents } from "../Events/useEvents";
import ShowMe from "../../utils/ShowMe";
import {
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Slider
} from "@material-ui/core";
import { withStyles, createStyles } from "@material-ui/core/styles";
import fakeEvents from "./fakeEvents";
//
//
const EditTours = () => {
  const topOfMonth = moment()
    .startOf("month")
    .format();
  const endOfYear = moment()
    .endOf("year")
    .format();
  // const { events } = useTimeRangeEvents(topOfMonth, endOfYear);
  const [tours, setTours] = useState([]);
  const [values, setValues] = useState([1]);
  const events = fakeEvents;
  const eventsArr = useMemo(() => {
    return events
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
      .map((event, index) => ({
        value: index,
        label: (
          <div>
            <Typography component="span">
              <b>{moment(event.startDate).format("MMM D")}</b>
            </Typography>
            {" • "}
            <Typography component="span">{event.startLoc.venueName}</Typography>
          </div>
        )
      }));
  }, [events]);

  const StyledSlider = withStyles({
    thumbColorPrimary: { color: "orange" }
  })(Slider);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} style={{ display: "flex" }}>
        <Slider
          min={0}
          max={events.length}
          valueLabelDisplay="auto"
          valueLabelFormat={(value, index) => `val ${value} ind ${index}`}
          marks={eventsArr.map(ev => ({ value: ev.value }))}
          defaultValue={[1, 4]}
          onChange={(e: any, val) => {
            console.log("val", val);
          }}
          onChangeCommitted={(e, val) => console.log("committed", val)}
          orientation="vertical"
          style={{ height: "100vh" }}
        />
        <Slider
          min={0}
          max={events.length}
          valueLabelDisplay="auto"
          valueLabelFormat={(value, index) => `val ${value} ind ${index}`}
          marks={eventsArr}
          defaultValue={[1, 4]}
          onChange={(e: any, val) => {
            console.log("val", val);
          }}
          onChangeCommitted={(e, val) => console.log("committed", val)}
          orientation="vertical"
          style={{ height: "100vh" }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {/* <Button onClick={()=>}>add one</Button> */}
      </Grid>
      <Grid item xs={12}>
        <ShowMe obj={events} name="events" />
      </Grid>
    </Grid>
  );
};

export default EditTours;
