import React, { useState, Fragment, useEffect } from "react";
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
  Collapse,
  Tabs,
  Tab
} from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";
import GoogMap from "../Maps/GoogMap";
import EventLocationSection from "./EventLocationSection";
import EventWhenSection from "./EventWhenSection";
import Swipeable from "react-swipeable-views";
import EventLocInput from "../Forms/inputs/EventLocInput";
import moment from "moment-timezone";
import { DateTimeInput } from "../Forms/inputs/DateTimeInput";
import { useToursTimeRange } from "../Tours/useTours";
import { useEventFxns, useEvents } from "./useEvents";
import LoadingWhiteOut from "../Dialogs/LoadingWhiteOut";
import RotatingArrowButton from "../Cards/RotatingArrowButton";
import EventTimeItemsInput from "../Forms/inputs/EventTimeItems/EventTimeItemsInput";
import { EventCtxProvider } from "./EventCtx";
import QuestionCard from "./QuestionCard";
import { useFirebaseCtx } from "../Firebase";

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
  const { doDeleteEvent } = useFirebaseCtx();

  const [tabIndex, setTabIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { eventsObj } = useEvents(initialValues.tourId);

  const handleSubmit = async (values: any) => {
    const tourDates = Object.keys(eventsObj);
    let newTourBoundaries;
    values.startTime = moment(values.startTime).format();
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
    await handleEventSubmit(values, () => null, newTourBoundaries);
    setSubmitting(false);
  };

  const steps = (
    values: any,
    handleSubmit?: () => void,
    pristine?: boolean
  ) => [
    {
      title: "Where",
      component: (
        <EventLocationSection
          location={values.location}
          label="Choose a Location"
        />
      ),
      button: (
        <Button
          disabled={!values.location}
          onClick={() => setTabIndex(old => ++old)}
          variant="contained"
          color="primary"
        >
          Next <ArrowRight />
        </Button>
      )
    },
    {
      title: "When",
      component: (
        <EventWhenSection
          name="startTime"
          //@ts-ignore
          timeZoneId={values.location && values.location.timeZoneId}
        />
      ),
      button: (
        <Button
          disabled={!values.startTime || !values.location}
          onClick={() => {
            !pristine && handleSubmit && handleSubmit();
            setTabIndex(old => ++old);
          }}
          variant="contained"
          color="primary"
        >
          Next <ArrowRight />
        </Button>
      )
    },
    {
      title: "Schedule",
      component: (
        <EventCtxProvider eventId={values.id} tourId={values.tourId}>
          <EventTimeItemsInput />
        </EventCtxProvider>
      ),
      button: (
        <Button variant="contained" color="primary">
          Next =>
        </Button>
      )
    }
  ];
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
                <Tabs
                  value={tabIndex}
                  onChange={(e: any, newValue: any) => {
                    setTabIndex(newValue);
                  }}
                  indicatorColor="primary"
                  centered
                >
                  {steps(values).map(({ title, component }, index) => {
                    return <Tab fullWidth label={title} />;
                  })}
                </Tabs>
                <Grid item xs={12}>
                  <Swipeable
                    index={tabIndex}
                    onChange={(...props) => console.log(props)}
                  >
                    {steps(values).map(({ title, component }, index) => {
                      return component;
                    })}
                  </Swipeable>
                </Grid>
                <Grid item xs={12}>
                  <CardActions style={{ justifyContent: "flex-end" }}>
                    {values.id && (
                      <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => {
                          values.id && doDeleteEvent(values.id);
                          handleClose();
                        }}
                      >
                        delete
                      </Button>
                    )}
                    {steps(values, handleSubmit, pristine)[tabIndex].button}
                  </CardActions>
                </Grid>
              </Grid>
              <ShowMe obj={values} name="values" />
              {/* <ShowMe obj={initialValues} name="initialValues" /> */}
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
