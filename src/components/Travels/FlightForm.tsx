import React, { useState, useEffect } from "react";
import { useDialogCtx } from "../Dialogs/DialogCtx";
import ShowMe from "../../utils/ShowMe";
import { fakeFromAirports, fakeToAirports } from "./fakeInfo";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  ListItemText
} from "@material-ui/core";
import LocationsSelect from "./LocationsSelect";
import { LocBasicType } from "../Locations/location.types";
import { Form, Field } from "react-final-form";
import DateInput from "../Forms/inputs/DateInput";
import { useEvents } from "../Events/useEvents";
import moment from "moment";
import { useAmadeus } from "../../apis/Amadeus";
import { AirportResult } from "../../apis/amadeus.types";
import DestinationAirportsPicker from "./DestinationAirportsPicker";

const FlightForm = () => {
  const { state } = useDialogCtx();
  const { events } = useEvents(state.initialValues.tourId);
  const { getAirportsNearPoint } = useAmadeus();
  const [fromPlaceId, setFromPlaceId] = useState("");
  const [fromAirports, setFromAirports] = useState<AirportResult[]>(
    fakeFromAirports
  );
  const [toAirports, setToAirports] = useState<AirportResult[]>(fakeToAirports);
  const [toPlaceId, setToPlaceId] = useState("");
  useEffect(() => {
    const defaultToLocIndex = events.findIndex(event =>
      moment(event.startTime)
        .endOf("day")
        .isAfter(state.initialValues.date)
    );
    console.log("defaultToLocIndex", defaultToLocIndex);
    const initialFromPlaceId =
      (events[defaultToLocIndex - 1] &&
        events[defaultToLocIndex - 1].locBasic.placeId) ||
      "";
    const initialToPlaceId =
      (events[defaultToLocIndex] &&
        events[defaultToLocIndex].locBasic.placeId) ||
      "";
    if (initialFromPlaceId || initialToPlaceId) {
      setFromPlaceId(initialFromPlaceId);
      setToPlaceId(initialToPlaceId);
    }
  }, [state, events]);

  useEffect(() => {
    // see if airports already searched
    if (!events) return;
    const fromEvent = events.find(evt => evt.locBasic.placeId === fromPlaceId);
    const toEvent = events.find(evt => evt.locBasic.placeId === toPlaceId);
    console.log("from to", fromEvent, toEvent);
    async function getFromAirports() {
      const fromLat = fromEvent && fromEvent.locBasic && fromEvent.locBasic.lat;
      const fromLng = fromEvent && fromEvent.locBasic && fromEvent.locBasic.lng;
      if (fromLat && fromLng) {
        const fromAirports = await getAirportsNearPoint(fromLat, fromLng);
        fromAirports && setFromAirports(fromAirports);
      }
    }

    async function getToAirports() {
      const toLat = toEvent && toEvent.locBasic && toEvent.locBasic.lat;
      const toLng = toEvent && toEvent.locBasic && toEvent.locBasic.lng;
      if (toLat && toLng) {
        const toAirports = await getAirportsNearPoint(toLat, toLng);
        toAirports && setToAirports(toAirports);
      }
    }
    if (fromEvent && !fromAirports.length) {
      getFromAirports();
    } else {
      console.log("no FROM event");
    }
    if (toEvent && !toAirports.length) {
      getToAirports();
    } else {
      console.log("no TO event");
    }
  }, [
    fromPlaceId,
    toPlaceId,
    events,
    fromAirports,
    getAirportsNearPoint,
    toAirports
  ]);

  const handleSubmit = (values: any) => {
    console.log("values", values);
  };
  const locations = events
    .map(event => event.locBasic)
    .filter(
      (loc, index, arr) =>
        index === arr.findIndex(_loc => _loc.placeId === loc.placeId)
    );
  return (
    <Form onSubmit={handleSubmit} initialValues={{ ...state.initialValues }}>
      {({ handleSubmit, values }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Flight Plan</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateInput name="date" label="Date" />
              </Grid>
              <Grid container spacing={4} item xs={12}>
                <Grid item xs={12} sm={6}>
                  <DestinationAirportsPicker locations={locations} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DestinationAirportsPicker arriving locations={locations} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit">SAVE</Button>
              </Grid>
              <Grid item xs={6}>
                <ShowMe obj={fromPlaceId} name="fromPlaceId" />
                <ShowMe obj={values} name="values" />
                <ShowMe obj={fromAirports} name="fromAirports" />
              </Grid>
              <Grid item xs={6}>
                <ShowMe obj={toAirports} name="toAirports" />
                <ShowMe obj={toPlaceId} name="toPlaceId" />
                <ShowMe obj={state} name="state" />
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Form>
  );
};

export default FlightForm;
