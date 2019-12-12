import React, { useState, useMemo, memo } from "react";
import {
  Grid,
  List,
  ListItem,
  Typography,
  IconButton,
  Slider,
  Tooltip,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import moment, { Moment } from "moment";
import styled from "styled-components";
import { FaArrowCircleDown, FaPlane, FaStar } from "react-icons/fa";
import ShowMe from "../../utils/ShowMe";
import { useMonthEvents, useTimeRangeEvents } from "../Events/useEvents";
import { GeneralEvent } from "../Events/event.types";
import GoogMapEvents from "./GoogMapEvents";
import { MapCtxProvider, useMapCtx } from "./MapCtx";
import { unixToDayArray, unixToDay } from "./mapHelpers";
import GridLabels from "./MapPageComponents/GridLabels";
import EventGridIcons from "./MapPageComponents/EventGridIcons";
import SelectedEventDisplay from "./MapPageComponents/SelectedEventDisplay";
//
//
const MapPageProvider = () => {
  return (
    <MapCtxProvider>
      <MapPage2 />
    </MapCtxProvider>
  );
};

const MapPage2 = () => {
  const [rangeStart, setRangeStart] = useState(
    moment()
      .subtract(5, "days")
      .startOf("day")
      .unix()
  );
  const [rangeEnd, setRangeEnd] = useState(
    moment()
      .add(10, "days")
      .endOf("day")
      .unix()
  );

  const { dayMarkers, totalDays } = useMemo(() => {
    return unixToDayArray(rangeStart, rangeEnd);
  }, [rangeStart, rangeEnd]);

  const { events } = useTimeRangeEvents(
    moment.unix(rangeStart).format(),
    moment.unix(rangeEnd).format()
  );

  const { selectedId } = useMapCtx();

  const handleChangeRange = (days = 5) => {
    const addDaysToUnix = (oldUnix: number) => {
      return moment
        .unix(oldUnix)
        .add(days, "days")
        .unix();
    };
    setRangeStart(old => addDaysToUnix(old));
    setRangeEnd(old => addDaysToUnix(old));
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        month picker{" "}
        <Button onClick={() => handleChangeRange(-5)}> - 5 days</Button>
        <Button onClick={() => handleChangeRange(5)}> + 5 days</Button>
      </Grid>
      <Grid item xs={2}>
        <DateGrid
          {...{
            totalDays,
            events,
            rangeStart,
            rangeEnd,
            dayMarkers
          }}
        />
      </Grid>
      <Grid item xs={10} container spacing={2} direction="column">
        <Grid item>
          <SelectedEventDisplay events={events} />
        </Grid>
        <Grid item>
          <div style={{ height: "350px" }}>
            <GoogMapEvents events={events} />
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ShowMe obj={events} name="events" />
        <ShowMe obj={{ rangeStart, rangeEnd }} name="ranges" noModal />
      </Grid>
    </Grid>
  );
};

export default MapPageProvider;

interface IMonthGrid {
  days: number;
  dayNames: string[];
}
const StyledGrid = styled.div<IMonthGrid>`
  display: grid;
  grid-template-rows: ${p => p.dayNames.map(name => `[${name}] max-content `)};
  grid-template-columns: repeat(5, max-content);
`;

const StyledSlider = withStyles({})(Slider);

interface IDateGrid {
  rangeStart: number;
  rangeEnd: number;
  events?: GeneralEvent[];
  totalDays: number;
  dayMarkers: {
    label: string;
    value: number;
    moment: Moment;
    dayNumber: number;
  }[];
}
const DateGrid = ({
  rangeStart,
  rangeEnd,
  events,
  totalDays,
  dayMarkers
}: IDateGrid) => {
  const { selectedId, setSelectedId } = useMapCtx();
  const dayNames = dayMarkers.map(mark => `day${mark.dayNumber}`);
  return (
    <>
      <StyledGrid days={totalDays} dayNames={dayNames}>
        <div style={{ gridColumn: 2, gridRow: "1 / -1" }}>
          <StyledSlider
            orientation="vertical"
            min={unixToDay(rangeStart)}
            max={unixToDay(rangeEnd)}
            defaultValue={[unixToDay(rangeStart), unixToDay(rangeEnd)]}
            onChangeCommitted={(e, val) => {
              console.log("val", val);
            }}
          />
        </div>
        <GridLabels dayMarkers={dayMarkers} />
        {events && <EventGridIcons events={events} />}
      </StyledGrid>
    </>
  );
};
