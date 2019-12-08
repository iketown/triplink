import React, { useState } from "react";
import ShowMe from "../../utils/ShowMe";
import { EventValues } from "../Dialogs/DialogCtx";
import { Form, Field } from "react-final-form";
import {
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Collapse
} from "@material-ui/core";
import GoogMap from "../Maps/GoogMap";
import EventLocInput from "../Forms/inputs/EventLocInput";
import moment from "moment-timezone";
import { DateTimeInput } from "../Forms/inputs/DateTimeInput";
import { useToursTimeRange } from "../Tours/useTours";
import { useEventFxns, useEvents } from "./useEvents";
import LoadingWhiteOut from "../Dialogs/LoadingWhiteOut";
import RotatingArrowButton from "../Cards/RotatingArrowButton";
import EventTimeItemsInput from "../Forms/inputs/EventTimeItems/EventTimeItemsInput";
import { EventCtxProvider } from "./EventCtx";

//
//
export const EventDialog = ({
  initialValues,
  handleClose
}: {
  initialValues: EventValues;
  handleClose: () => void;
}) => {
  const { handleEventSubmit } = useEventFxns();
  const {
    toursAfterDate,
    setEarliestEndDate,
    tourDatesObj,
    earliestDate
  } = useToursTimeRange();

  const [submitting, setSubmitting] = useState(false);
  const { eventsObj } = useEvents(initialValues.tourId);

  const handleSubmit = async (values: any) => {
    const tourDates = Object.keys(eventsObj);
    let newTourBoundaries;
    const firstTourDate = tourDates[0];
    const lastTourDate = tourDates[tourDates.length - 1];
    if (values.startTime < firstTourDate || values.startTime > lastTourDate) {
      // expand tour dates
      newTourBoundaries = {
        startDate:
          values.startTime < firstTourDate ? values.startTime : firstTourDate,
        endDate:
          values.startTime > lastTourDate ? values.startTime : lastTourDate
      };
    }
    setSubmitting(true);
    await handleEventSubmit(values, handleClose, newTourBoundaries);
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
                        <EventCtxProvider
                          eventId={values.id}
                          tourId={values.tourId}
                        >
                          <EventTimeItemsInput />
                        </EventCtxProvider>
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
