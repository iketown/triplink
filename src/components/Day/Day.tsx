import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { DatePicker, MaterialUiPickersDate } from "@material-ui/pickers";
import { Grid } from "@material-ui/core";
import { Moment } from "moment";
import { useEvents } from "../Events/useEvents";

const Day = (props: RouteComponentProps<{ date?: string }>) => {
  const { date } = props.match.params;
  const handleDateChange = (date: MaterialUiPickersDate) => {
    const goToDate = date && date.format("YYYY-MM-DD");
    if (goToDate) {
      props.history.push(`/day/${goToDate}`);
    }
  };
  return (
    <Grid>
      <Grid item xs={12}>
        <DatePicker onChange={handleDateChange} value={date} />
      </Grid>
    </Grid>
  );
};

export default Day;
