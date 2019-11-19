import React, { useState, useEffect } from "react";
import { useDialogCtx } from "../Dialogs/DialogCtx";
import ShowMe from "../../utils/ShowMe";
import { fakeFromAirports, fakeToAirports } from "./fakeInfo";
import { Grid, Typography, Button, Hidden } from "@material-ui/core";
import { Form, Field } from "react-final-form";
import DateInput from "../Forms/inputs/DateInput";
import { useEvents } from "../Events/useEvents";
import DestinationAirportsPicker from "./DestinationAirportsPicker";
import GoogMap from "../Maps/GoogMap";

const FlightForm = () => {
  const { state } = useDialogCtx();
  const { events, closeAirports } = useEvents(state.initialValues.tourId);

  const handleSubmit = (values: any) => {
    console.log("values", values);
  };
  type FlightErrors = {
    fromAirport?: string;
    toAirport?: string;
    date?: string;
  };
  const validate = (values: any) => {
    const errors: FlightErrors = {};
    if (
      values.fromAirport &&
      values.toAirport &&
      values.fromAirport.iataCode === values.toAirport.iataCode
    ) {
      errors.toAirport = "FROM and TO airports are the same";
      errors.fromAirport = "FROM and TO airports are the same";
    }

    return errors;
  };
  const locations = events
    .map(event => event.locBasic)
    .filter(
      (loc, index, arr) =>
        index === arr.findIndex(_loc => _loc.placeId === loc.placeId)
    );
  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={{ ...state.initialValues }}
      validate={validate}
    >
      {({ handleSubmit, values }) => {
        const markerLocs = [values.fromAirport, values.toAirport]
          .filter(ap => !!ap)
          .map(ap => {
            console.log("ap in filter", ap);
            ap.lat = ap.geoCode.latitude;
            ap.lng = ap.geoCode.longitude;
            return ap;
          });
        const polyLines = markerLocs.length >= 2 ? [markerLocs] : [];
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid container item xs={12}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">Flight Plan</Typography>
                  <DateInput name="date" label="Date" />
                  <DestinationAirportsPicker
                    closeAirports={closeAirports || []}
                    locations={locations}
                  />
                  <DestinationAirportsPicker
                    closeAirports={closeAirports || []}
                    arriving
                    locations={locations}
                  />
                </Grid>
                <Hidden xsDown>
                  <Grid item xs={12} sm={6}>
                    <GoogMap boundsPoints={markerLocs} polyLines={polyLines} />
                  </Grid>
                </Hidden>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit">SAVE</Button>
                <ShowMe obj={values} name="values" />
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Form>
  );
};

export default FlightForm;
