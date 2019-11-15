import React from "react";
import ShowMe from "../../utils/ShowMe";
import { EventValues } from "../Dialogs/DialogCtx";
import { Form, Field } from "react-final-form";
import { Grid, Button } from "@material-ui/core";
import GoogPlacesAC from "../Forms/googleAC/GooglePlacesAC";
import SelectInput from "../Forms/inputs/SelectInput";
import GoogMap from "../Maps/GoogMap";
import {
  getShortNameFromLoc,
  getTimeZoneFromLatLng
} from "../../utils/locationFxns";
import TextInput from "../Forms/inputs/TextInput";
import { useFirebaseCtx } from "../Firebase";
import moment from "moment-timezone";
import TimeInput from "../Forms/inputs/TimeInput";
import { LocBasicType, LocationType } from "../Locations/location.types";
import { DateTimeInput } from "../Forms/inputs/DateTimeInput";
import { useAmadeus } from "../../apis/Amadeus";
import { AirportResult } from "../../apis/amadeus.types";
//
//
export const EventDialog = ({
  initialValues,
  handleClose
}: {
  initialValues: EventValues;
  handleClose: () => void;
}) => {
  const { doCreateLocation, doCreateEvent, doEditEvent } = useFirebaseCtx();
  const { getAirportsNearPoint } = useAmadeus();
  const handleSubmit = async (values: any) => {
    // save location
    let airportsAll = await getAirportsNearPoint(
      values.location.lat,
      values.location.lng
    );
    if (!airportsAll) airportsAll = [];
    const locResponse = await doCreateLocation({
      ...values.location,
      airports: (airportsAll && airportsAll.slice(0, 3)) || []
    }).catch(err => console.log("error submitting LOCATION", err));
    if (!locResponse) return { error: "some kind of error" };
    const {
      id,
      lat,
      lng,
      venueName,
      address,
      timeZoneId,
      shortName,
      placeId
    } = locResponse;
    const locBasic = {
      id,
      lat,
      lng,
      venueName,
      address,
      timeZoneId,
      shortName,
      placeId,
      airport: airportsAll[0]
    };
    // save event with minimal location info and locId
    const { startDate, startTime, tourId, subTourIndex } = values;
    if (values.id) {
      //@ts-ignore
      await doEditEvent({
        startDate,
        startTime,
        locBasic,
        tourId,
        subTourIndex,
        id: values.id
      });
    } else {
      //@ts-ignore
      await doCreateEvent({
        startDate,
        startTime,
        locBasic,
        tourId,
        subTourIndex
      });
    }
    handleClose();
  };

  return (
    <Form onSubmit={handleSubmit} initialValues={initialValues}>
      {({ handleSubmit, values, form, submitting }) => {
        //@ts-ignore
        if (values.location && values.location.timeZoneId) {
          //@ts-ignore
          moment.tz.setDefault(values.location.timeZoneId);
        }
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid container spacing={2} item xs={12} sm={6}>
                <Grid item xs={12}>
                  <Field name="location">
                    {({ input }) => {
                      const handleChange = async (loc: LocationType) => {
                        loc.shortName = getShortNameFromLoc(loc);
                        const timeZoneId = await getTimeZoneFromLatLng({
                          lat: loc.lat,
                          lng: loc.lng,
                          timeStamp: Number(
                            moment(values.startDate).format("X")
                          )
                        });
                        loc.timeZoneId = timeZoneId;
                        moment.tz.setDefault(timeZoneId);
                        const formStartTime = moment
                          .tz(values.startDate, timeZoneId)
                          .startOf("day")
                          .add(20, "hours")
                          // .tz(timeZoneId)
                          .format();
                        //@ts-ignore
                        window.formStartTime = formStartTime;
                        form.change("startTime", formStartTime);
                        input.onChange(loc);
                      };
                      return (
                        <div style={{ marginBottom: "10px" }}>
                          <GoogPlacesAC setLocation={handleChange} />
                        </div>
                      );
                    }}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput label="Venue Name" name="location.venueName" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    label="Venue Location (short)"
                    name="location.shortName"
                  />
                </Grid>
                <Grid item xs={12}>
                  <DateTimeInput
                    name="startTime"
                    label="Date / Time"
                    //@ts-ignore
                    timeZoneId={values.location && values.location.timeZoneId}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectInput name="subTourIndex" label="Sub-Tour" />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                {values.location && <GoogMap markerLocs={[values.location]} />}
              </Grid>
              <Grid item xs={12}>
                <Button disabled={submitting} type="submit">
                  SAVE
                </Button>
              </Grid>
            </Grid>
            <ShowMe obj={values} name="values" noModal />
            <ShowMe obj={initialValues} name="initialValues" noModal />
          </form>
        );
      }}
    </Form>
  );
};

export default EventDialog;
