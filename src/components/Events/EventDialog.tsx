import React, { useState } from "react";
import ShowMe from "../../utils/ShowMe";
import { EventValues } from "../Dialogs/DialogCtx";
import { Form, Field } from "react-final-form";
import {
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Collapse
} from "@material-ui/core";
import GoogPlacesAC from "../Forms/googleAC/GooglePlacesAC";
import SelectInput from "../Forms/inputs/SelectInput";
import GoogMap from "../Maps/GoogMap";
import PeopleInput from "../Forms/inputs/PeopleInput";
import EventLocInput from "../Forms/inputs/EventLocInput";
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
import { amadeusFxns } from "../../apis/Amadeus";
import { AirportResult } from "../../apis/amadeus.types";
import { useEventFxns } from "./useEvents";
import LoadingWhiteOut from "../Dialogs/LoadingWhiteOut";
import RotatingArrowButton from "../Cards/RotatingArrowButton";
import EventTimeItemsInput from "../Forms/inputs/EventTimeItemsInput";
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
  const { getAirportsNearPoint } = amadeusFxns();
  const { handleEventSubmit } = useEventFxns();
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    await handleEventSubmit(values, handleClose);
    setSubmitting(false);
  };

  return (
    <Form onSubmit={handleSubmit} initialValues={initialValues}>
      {({ handleSubmit, values, form, pristine, hasValidationErrors }) => {
        //@ts-ignore
        if (values.location && values.location.timeZoneId) {
          //@ts-ignore
          moment.tz.setDefault(values.location.timeZoneId);
        }
        return (
          <div style={{ position: "relative" }}>
            {submitting && <LoadingWhiteOut />}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* 👈👈 LEFT SIDE 👈👈 */}
                <Grid item xs={12} sm={6} container spacing={2}>
                  <Grid item xs={12}>
                    <CardBackground title="When ?">
                      <DateTimeInput
                        name="startTime"
                        label="Date / Time"
                        //@ts-ignore
                        timeZoneId={
                          values.location && values.location.timeZoneId
                        }
                      />
                    </CardBackground>
                  </Grid>
                  <Grid item xs={12}>
                    {values.tourId && (
                      <CardBackground noContentWrap title="Who ?">
                        <PeopleInput name="memberIds" tourId={values.tourId} />
                      </CardBackground>
                    )}
                  </Grid>
                </Grid>
                {/* 👈👈 LEFT SIDE 👈👈 */}

                {/* 👉👉 RIGHT SIDE 👉👉 */}
                <Grid item xs={12} sm={6} container spacing={2}>
                  <Grid item xs={12}>
                    <CardBackground
                      title="Where ?"
                      noContentWrap
                      defaultOpen={!values.location}
                    >
                      <EventLocInput location={values.location} />
                      {values.location && (
                        <GoogMap markerLocs={[values.location]} />
                      )}
                    </CardBackground>
                  </Grid>
                  {values.id && (
                    <Grid item xs={12}>
                      <CardBackground title="Schedule" defaultOpen={true}>
                        <EventTimeItemsInput event={values} />
                      </CardBackground>
                    </Grid>
                  )}
                  {/* 👉👉 RIGHT SIDE 👉👉 */}
                </Grid>

                <Grid item xs={12} justify="flex-end">
                  <CardActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                      disabled={pristine || hasValidationErrors || submitting}
                      variant={"contained"}
                      color="primary"
                      type="submit"
                    >
                      SAVE
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
              <ShowMe obj={values} name="values" />
              <ShowMe obj={initialValues} name="initialValues" />
            </form>
          </div>
        );
      }}
    </Form>
  );
};

export default EventDialog;

const CardBackground = ({
  children,
  title,
  noContentWrap,
  defaultOpen
}: {
  children: any;
  title: string;
  noContentWrap?: boolean;
  defaultOpen?: boolean;
}) => {
  const [expanded, setExpanded] = useState(!!defaultOpen);
  return (
    <Card>
      <div
        style={{
          padding: "4px 16px",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <Typography variant="overline">{title}</Typography>
        <RotatingArrowButton
          expanded={expanded}
          onClick={() => setExpanded(old => !old)}
        />
      </div>
      <Collapse in={expanded}>
        {noContentWrap && children}
        {!noContentWrap && <CardContent>{children}</CardContent>}
      </Collapse>
    </Card>
  );
};
