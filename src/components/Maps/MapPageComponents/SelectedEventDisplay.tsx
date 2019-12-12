import React from "react";
import { useMapCtx } from "../MapCtx";
import { GeneralEvent } from "../../Events/event.types";
import ShowMe from "../../../utils/ShowMe";
import { Typography, Grid, Button } from "@material-ui/core";

//
//
const SelectedEventDisplay = ({ events }: { events: GeneralEvent[] }) => {
  const { selectedId, setSelectedId } = useMapCtx();
  const event = events.find(event => event.id === selectedId);
  const eventIndex = events.findIndex(event => event.id === selectedId);
  const nextEvent = events[eventIndex + 1];
  const prevEvent = events[eventIndex - 1];

  if (!event) return <div>nothing selected</div>;
  if (event.eventType === "show") {
    return (
      <Grid container spacing={2}>
        <Grid item xs={2}>
          {prevEvent && (
            <Button onClick={() => prevEvent.id && setSelectedId(prevEvent.id)}>
              prev
            </Button>
          )}
        </Grid>
        <Grid item>
          <EventDisplay {...{ event }} />;
        </Grid>
        <Grid item xs={2}>
          {nextEvent && (
            <Button onClick={() => nextEvent.id && setSelectedId(nextEvent.id)}>
              prev
            </Button>
          )}
        </Grid>
      </Grid>
    );
  }
  if (event.eventType === "flight") {
    return <div>its a flight</div>;
  }
  return <div>i dont know</div>;
};

export default SelectedEventDisplay;

const EventDisplay = ({ event }: { event: GeneralEvent }) => {
  return (
    <div>
      <Typography>{event.id}</Typography>
      <ShowMe obj={event} name="event" />
    </div>
  );
};
