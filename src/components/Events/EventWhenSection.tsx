import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { DatePicker, TimePicker } from "@material-ui/pickers";
import { Field } from "react-final-form";
interface IEventWhenSection {
  name?: string;
  timeZoneId?: string;
}
const EventWhenSection = ({ name, timeZoneId }: IEventWhenSection) => {
  return (
    <Field name="startTime">
      {({ input, meta }) => {
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DatePicker
                value={input.value}
                onChange={time => input.onChange(time)}
                variant="static"
                orientation="landscape"
                autoOk
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimePicker
                value={input.value}
                onChange={time => input.onChange(time)}
                variant="static"
                orientation="landscape"
              />
              {timeZoneId && <Typography>{timeZoneId}</Typography>}
            </Grid>
          </Grid>
        );
      }}
    </Field>
  );
};

export default EventWhenSection;
