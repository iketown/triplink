import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import moment from "moment-timezone";
import { DateTimePicker, MaterialUiPickersDate } from "@material-ui/pickers";
import { useFormCtx } from "./FormCtx";
import EventCard from "./EventCard";
import TimeIncrementor from "./TimeIncrementer";
//
//
const EventWhenCardOLD = () => {
  const { timeZone, data, handleFieldChange } = useFormCtx();

  return (
    <div>
      <Grid item xs={12} sm={5}>
        <DateTimePicker
          fullWidth
          label="start time"
          value={
            timeZone
              ? moment(data.startDate).tz(timeZone)
              : moment(data.startDate)
          }
          onChange={(date: MaterialUiPickersDate) =>
            date && handleFieldChange("startDate", date.toDate())
          }
          format={data.allDay ? "MMMM Do" : `MMM Do h:mma`}
        />
      </Grid>
      <Grid item xs={12} sm={5}>
        <DateTimePicker
          fullWidth
          label="end time"
          value={
            timeZone ? moment(data.endDate).tz(timeZone) : moment(data.endDate)
          }
          onChange={(date: MaterialUiPickersDate) =>
            date && handleFieldChange("endDate", date.toDate())
          }
          format={data.allDay ? "MMMM Do" : `MMM Do h:mma`}
        />
      </Grid>
    </div>
  );
};

//
//

const EventWhenCard = () => {
  const { data, timeZone, handleFieldChange } = useFormCtx();
  const [expanded, setExpanded] = useState(!data.startLoc);
  const summarizeTimes = (): string => {
    if (!data.startDate) return "";
    const start = moment(data.startDate);
    const end = moment(data.endDate);
    if (start.date() === end.date()) {
      // just show times
      return `${start.format("h:mma")} - ${end.format("h:mma")}`;
    } else {
      // show dates and times
      let startFormat = "MMM Do h:mma";
      let endFormat = "MMM Do h:mma";

      return `${moment(data.startDate).format(startFormat)} - ${moment(
        data.endDate
      ).format(endFormat)}`;
    }
  };
  return (
    <EventCard
      category="when"
      {...{ expanded, setExpanded }}
      title={data.startDate ? moment(data.startDate).format("MMM Do") : "when?"}
      subheader={summarizeTimes()}
      content={
        <>
          <Grid item xs={12}>
            <DateTimePicker
              fullWidth
              label="start time"
              value={
                timeZone
                  ? moment(data.startDate).tz(timeZone)
                  : moment(data.startDate)
              }
              onChange={(date: MaterialUiPickersDate) =>
                date && handleFieldChange("startDate", date.toDate())
              }
              format={data.allDay ? "MMMM Do" : `MMM Do h:mma`}
            />
          </Grid>
          <Grid item xs={12}>
            <TimeIncrementor
              minutes={
                moment(data.endDate)
                  .diff(data.startDate)
                  .valueOf() /
                1000 /
                60
              }
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
          <Grid item xs={12}>
            <DateTimePicker
              fullWidth
              label="end time"
              value={
                timeZone
                  ? moment(data.endDate).tz(timeZone)
                  : moment(data.endDate)
              }
              onChange={(date: MaterialUiPickersDate) =>
                date && handleFieldChange("endDate", date.toDate())
              }
              format={data.allDay ? "MMMM Do" : `MMM Do h:mma`}
            />
          </Grid>
        </>
      }
    />
  );
};

export default EventWhenCard;
