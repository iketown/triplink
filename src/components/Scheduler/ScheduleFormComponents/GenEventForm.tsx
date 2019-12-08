import React, { Fragment } from "react";
import { Grid, TextField } from "@material-ui/core";
import { DateTimePicker, MaterialUiPickersDate } from "@material-ui/pickers";
import TimeIncrementer from "./TimeIncrementer";
import RecentLocPicker from "./RecentLocPicker";
import moment from "moment";
import { useTimeRangeEvents } from "../../Events/useEvents";
import ShowMe from "../../../utils/ShowMe";
import GoogMap from "../../Maps/GoogMap";

//
//
const GenEventForm = ({
  data,
  handleFieldChange
}: {
  data: any;
  handleFieldChange: (fieldName: string, newValue: any) => void;
}) => {
  return (
    <Fragment>
      <Grid item xs={12} sm={6}>
        <TimeIncrementer
          minutes={moment(data.endDate).diff(data.startDate) / 1000 / 60}
          setMinutes={min => {
            handleFieldChange(
              "endDate",
              moment(data.startDate)
                .add(min, "minutes")
                .toDate()
            );
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RecentLocPicker
          targetDate={data.startDate}
          loc={data.startLoc}
          locId={data.locId}
          onSelectLoc={loc => handleFieldChange("startLoc", loc)}
          onSelectId={id => handleFieldChange("locId", id)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {data.startLoc && <GoogMap markerLocs={[data.startLoc]} />}
      </Grid>
      <Grid item xs={12}></Grid>
    </Fragment>
  );
};

export default GenEventForm;
