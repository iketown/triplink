import React, { useState, useEffect, useMemo } from "react";
import { Grid, Button, Slider, Tooltip, IconButton } from "@material-ui/core";
import { useTimeRangeEvents } from "../Events/useEvents";
import moment from "moment";
import ShowMe from "../../utils/ShowMe";
import { DatePicker, MaterialUiPickersDate } from "@material-ui/pickers";
import { number } from "prop-types";
import { eventTypes } from "../Scheduler/eventFormHelpers";
import GoogMap from "./GoogMap";
import { GeneralEvent } from "../Events/event.types";
import { MapCtxProvider, useMapCtx } from "./MapCtx";
//
//

const MapPageEventsProvider = () => {
  const [firstDate, setFirstDate] = useState(
    moment()
      .startOf("month")
      .format()
  );
  const [lastDate, setLastDate] = useState(
    moment()
      .endOf("month")
      .format()
  );
  const { events } = useTimeRangeEvents(firstDate, lastDate);
  return (
    <MapPage {...{ firstDate, lastDate, setFirstDate, setLastDate, events }} />
  );
};

const MapPage = ({
  events,
  setFirstDate,
  setLastDate,
  firstDate,
  lastDate
}: {
  events: any[];
  setFirstDate: (date: string) => void;
  setLastDate: (date: string) => void;
  firstDate: string;
  lastDate: string;
}) => {
  const [sliderRange, setSliderRange] = useState<{
    min: number;
    max: number;
  }>();
  const reverseEvents = useMemo(() => {
    return events.reverse();
  }, [events]);
  const filteredEvents = useMemo(() => {
    return reverseEvents
      ? reverseEvents.filter((event, index) => {
          if (sliderRange) {
            if (sliderRange.min > index) return null;
            if (sliderRange.max < index) return null;
          }
          return event;
        })
      : [];
  }, [reverseEvents, sliderRange]);

  useEffect(() => {
    if (events && events.length && !sliderRange) {
      setSliderRange({ min: 0, max: events.length });
    }
  }, [sliderRange, events]);
  return (
    <MapCtxProvider>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <DatePicker
            value={firstDate}
            onChange={date => date && setFirstDate(date.format())}
          />
          <DatePicker
            value={lastDate}
            onChange={date => date && setLastDate(date.format())}
          />
        </Grid>
        <Grid item xs={2} style={{ display: "flex" }}>
          <div style={{ minHeight: `${events.length * 1.2}rem` }}>
            {sliderRange && (
              <Slider
                style={{ height: `${events.length * 1.4}rem` }}
                onChange={(e, val) => {
                  console.log("val", val);
                  if (typeof val === "object") {
                    const [min, max] = val;
                    setSliderRange({ min, max });
                  }
                }}
                defaultValue={
                  sliderRange ? [sliderRange.min, sliderRange.max] : [0, 0]
                }
                value={[sliderRange.min, sliderRange.max]}
                orientation="vertical"
                min={0}
                max={events.length}
                marks={
                  reverseEvents &&
                  reverseEvents.map((event, index) => {
                    return {
                      value: index,
                      label: <SliderLabel {...{ event }} />
                    };
                  })
                }
              />
            )}
          </div>
        </Grid>
        <Grid item xs={10}>
          <EventMapper {...{ filteredEvents }} />
        </Grid>
        <Grid item xs={12}>
          <ShowMe obj={sliderRange} name="sliderRange" noModal />
          <ShowMe obj={events} name="events" noModal />
        </Grid>
        Map MapPage
      </Grid>
    </MapCtxProvider>
  );
};

export default MapPageEventsProvider;

const SliderLabel = ({ event }: { event: GeneralEvent }) => {
  const Icon = event.eventType && eventTypes[event.eventType].Icon;
  const title =
    event.eventType === "flight" && event.endLoc
      ? `${event.startLoc.iataCode} - ${event.endLoc.iataCode}`
      : event.startLoc.venueName;

  const { selectedId, setSelectedId } = useMapCtx();
  const handleMouseOver = () => {
    if (event.id && selectedId !== event.id) {
      setSelectedId(event.id);
    }
  };
  return (
    <Tooltip title={title}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {moment(event.startDate).format("M.DD")}
        {Icon && (
          <IconButton size="small" onMouseOver={handleMouseOver}>
            <Icon
              style={{
                marginLeft: "5px",
                color: "lightgrey"
              }}
            />
          </IconButton>
        )}
      </div>
    </Tooltip>
  );
};

const EventMapper = ({
  filteredEvents
}: {
  filteredEvents: GeneralEvent[];
}) => {
  const { polylines, showMarkers, genMarkers } = useMemo(() => {
    const _eventsObj = filteredEvents.reduce(
      (
        obj: {
          flights: GeneralEvent[];
          generic: GeneralEvent[];
          shows: GeneralEvent[];
        },
        event
      ) => {
        switch (event.eventType) {
          case "show": {
            return { ...obj, shows: [...obj.shows, event] };
          }
          case "generic": {
            return { ...obj, generic: [...obj.generic, event] };
          }
          case "flight": {
            return { ...obj, flights: [...obj.flights, event] };
          }
          default:
            return obj;
        }
      },
      { flights: [], generic: [], shows: [] }
    );
    const polylines = _eventsObj.flights.map(
      event =>
        !!event.startLoc &&
        !!event.endLoc && {
          eventId: event.id,
          path: [event.startLoc, event.endLoc]
        }
    );
    const showMarkers = _eventsObj.shows.map(event => ({
      eventId: event.id,
      ...event.startLoc
    }));
    const genMarkers = _eventsObj.generic.map(event => ({
      eventId: event.id,
      ...event.startLoc
    }));
    return { polylines, showMarkers, genMarkers };
  }, [filteredEvents]);
  return (
    <GoogMap
      //@ts-ignore
      polyLines={polylines}
      markerLocs={showMarkers}
    />
  );
};
