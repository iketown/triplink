import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { DatePicker, MaterialUiPickersDate } from "@material-ui/pickers";
import { Grid, Button } from "@material-ui/core";
import { ArrowRight, ArrowLeft } from "@material-ui/icons";
import moment, { Moment } from "moment";
import DayGrid from "./DayGrid";
import { useTours } from "../Tours/useTours";
import { useEvents } from "../Events/useEvents";
//
//
const Day = (props: RouteComponentProps<{ date?: string }>) => {
  const { date } = props.match.params;
  const { tours } = useTours();
  const tour = tours[0]; // TODO get the right tour

  const handleDateChange = (date: MaterialUiPickersDate) => {
    const goToDate = date && date.format("YYYY-MM-DD");
    if (goToDate) {
      props.history.push(`/day/${goToDate}`);
    }
  };
  const prevNextDay = (delta: number) => {
    const newDate = moment(date)
      .add(delta, "day")
      .format("YYYY-MM-DD");
    props.history.push(`/day/${newDate}`);
  };
  return (
    <Grid>
      <Grid item xs={12}>
        <Button
          style={{ margin: "0 1rem 0 0" }}
          variant="outlined"
          onClick={() => prevNextDay(-1)}
        >
          <ArrowLeft />{" "}
          {moment(date)
            .add(-1, "day")
            .format("ddd D")}
        </Button>
        <DatePicker onChange={handleDateChange} value={date} />
        <Button
          style={{ margin: "0 0 0  1rem" }}
          variant="outlined"
          onClick={() => prevNextDay(1)}
        >
          {moment(date)
            .add(1, "day")
            .format("ddd D")}
          <ArrowRight />
        </Button>
      </Grid>
      <Grid item xs={12}>
        {date && tour && <DayGrid date={date} tour={tour} />}
      </Grid>
    </Grid>
  );
};

export default Day;
