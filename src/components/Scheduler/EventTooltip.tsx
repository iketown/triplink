import React from "react";
import { AppointmentTooltipProps } from "@devexpress/dx-react-scheduler-material-ui";
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler";
import { Grid, Typography } from "@material-ui/core";

//
//
const EventTooltip = (props: AppointmentTooltip.ContentProps) => {
  console.log("tooltip propsx", props);
  const {
    //@ts-ignore
    appointmentData: { title, tourId }
  } = props;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">{title}</Typography>
      </Grid>
    </Grid>
  );
};

export default EventTooltip;
