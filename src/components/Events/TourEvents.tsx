import React, { useEffect, useState, useMemo, Fragment } from "react";
import {
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Collapse,
  Typography,
  Button,
  Divider,
  ListItemSecondaryAction,
  Grid
} from "@material-ui/core";
import RotatingArrowButton from "../Cards/RotatingArrowButton";
import GoogMap from "../Maps/GoogMap";
import { StarBorder, Add, ArrowDropDown } from "@material-ui/icons";
import { useFirebaseCtx } from "../Firebase";
import useAuth from "../Account/UserCtx";
import { Tour } from "../Tours/types";
import ShowMe from "../../utils/ShowMe";
import moment, { Moment } from "moment";
import { getArrayOfDates } from "../../utils/dateFxns";
import { useEvents } from "./useEvents";
import { TourEvent } from "./event.types";
import { useDialogCtx } from "../Dialogs/DialogCtx";

export const TourEvents = ({ tour }: { tour: Tour }) => {
  const { firestore, doUpdateTour } = useFirebaseCtx();
  const { events, eventsObj } = useEvents(tour.id);
  const { dispatch } = useDialogCtx();

  const handleCreateEvent = () => {
    dispatch({
      type: "CREATE_EVENT",
      initialValues: {
        startDate: tour.startDate,
        tourId: tour.id,
        subTourIndex: 0
      }
    });
  };

  const handleFitTourToEvents = () => {
    const tourDates = Object.keys(eventsObj);
    const startDate = tourDates[0];
    const endDate = tourDates[tourDates.length - 1];
    doUpdateTour(tour.id, { startDate, endDate });
  };

  if (!events.length)
    return (
      <CardContent style={{ textAlign: "center" }}>
        <Typography gutterBottom>No Events</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateEvent}>
          Create Event
        </Button>
      </CardContent>
    );
  return (
    <>
      <CardContent>
        <Grid container>
          <Grid item xs={12} md={6}>
            <List dense>
              {Object.entries(eventsObj).map(([date, eventArr], index) => {
                const isFirst = index === 0;
                const isLast = index === Object.keys(eventsObj).length - 1;
                const nextDate = Object.values(eventsObj)[index + 1];
                const nextDateTime = nextDate ? nextDate[0].startTime : null;
                const isGigNextDay =
                  nextDateTime &&
                  moment(eventArr[0].startTime)
                    .endOf("day")
                    .add(1, "day")
                    .isSameOrAfter(nextDateTime);
                return (
                  <Fragment key={date}>
                    {isFirst && (
                      <TourEventSpacerListItem
                        tourId={tour.id}
                        key={date + "before"}
                        date={moment(eventArr[0].startTime).subtract(1, "day")}
                      />
                    )}
                    {
                      //@ts-ignore
                      <TourEventListItem
                        date={date}
                        eventArr={eventArr}
                        isFirst={isFirst}
                      />
                    }
                    {!isLast && !isGigNextDay && nextDateTime && (
                      <TourEventSpacerDates
                        tourId={tour.id}
                        key={date + "inBetween"}
                        mustBeAfter={eventArr[0].startTime}
                        mustBeBefore={nextDateTime}
                      />
                    )}
                    {isLast && (
                      <TourEventSpacerListItem
                        tourId={tour.id}
                        key={date + "after"}
                        date={moment(eventArr[0].startTime).add(1, "day")}
                      />
                    )}
                  </Fragment>
                );
              })}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <GoogMap
              markerLocs={events.map(evt => evt.locBasic)}
              polyLines={[events.map(evt => evt.locBasic)]}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button onClick={handleFitTourToEvents}>Fit Tour to Events</Button>
      </CardActions>
    </>
  );
};

function TourEventListItem({
  date,
  eventArr,
  isFirst
}: {
  date: string;
  eventArr: TourEvent[];
  isFirst?: boolean;
}) {
  return eventArr.map((event, index) => {
    return (
      <TourEventSingleListItem
        key={event.id}
        event={event}
        date={date}
        dividerBottom={index + 1 === eventArr.length}
      />
    );
  });
}

const TourEventSingleListItem = ({
  event,
  date,
  dividerBottom = true
}: {
  event: TourEvent;
  date: string;
  dividerBottom?: boolean;
}) => {
  const { dispatch } = useDialogCtx();
  const handleEditEvent = () => {
    const { locBasic, ...eventInfo } = event;
    const { venueName, shortName } = locBasic;
    const initialValues = {
      ...eventInfo,
      location: locBasic,
      venueName,
      shortName
    };
    dispatch({ type: "EDIT_EVENT", initialValues });
  };
  return (
    <>
      <ListItem button onClick={handleEditEvent}>
        <Fragment key={event.id}>
          <ListItemAvatar>
            <StarBorder />
          </ListItemAvatar>
          <ShowMe obj={event} name={""} />
          <ListItemText
            primary={`${date} • ${event.locBasic && event.locBasic.shortName}`}
          />
          <ListItemSecondaryAction></ListItemSecondaryAction>
        </Fragment>
      </ListItem>
      {dividerBottom && <Divider />}
    </>
  );
};

const TourEventSpacerListItem = ({
  date,
  tourId
}: {
  date: Moment;
  tourId: string;
}) => {
  const { dispatch } = useDialogCtx();
  const handleCreateEvent = () => {
    dispatch({
      type: "CREATE_EVENT",
      initialValues: {
        startDate: date,
        startTime: moment(date)
          .startOf("day")
          .add(20, "hours"),
        tourId,
        //TODO - set subTourIndex according to date
        //  whatever the prev event's subTourINdex is ?
        subTourIndex: 0
      }
    });
  };
  return (
    <ListItem divider dense button onClick={handleCreateEvent}>
      <ListItemAvatar>
        <Add />
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{ color: "textSecondary" }}
        primary={`${date.format("ddd MM/DD")}`}
      />
    </ListItem>
  );
};

const TourEventSpacerDates = ({
  mustBeBefore,
  mustBeAfter,
  tourId
}: {
  mustBeAfter: string;
  mustBeBefore: string;
  tourId: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const arrayOfDates = useMemo(() => {
    return getArrayOfDates({
      first: moment(mustBeAfter)
        .add(1, "day")
        .format(),
      last: moment(mustBeBefore)
        .subtract(1, "day")
        .format()
    });
  }, [mustBeAfter, mustBeBefore]);

  if (arrayOfDates.length === 1) {
    return (
      <TourEventSpacerListItem
        tourId={tourId}
        date={moment(mustBeAfter).add(1, "day")}
      />
    );
  }
  return (
    <>
      <ListItem
        selected={expanded}
        divider
        dense
        button
        onClick={() => setExpanded(old => !old)}
      >
        <ListItemAvatar>
          <RotatingArrowButton expanded={expanded} direction="cw" />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ color: "textSecondary" }}
          primary={"add new"}
        />
      </ListItem>
      <Collapse in={expanded}>
        {arrayOfDates.map((date, index) => {
          return (
            <TourEventSpacerListItem
              key={date.toISOString()}
              tourId={tourId}
              date={date}
            />
          );
        })}
      </Collapse>
    </>
  );
};

export default TourEvents;
