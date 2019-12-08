import React, { useState } from "react";
import { TimePicker } from "@material-ui/pickers";
import { Typography, Link } from "@material-ui/core";
import moment from "moment";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

//
//
const TimeDisplay = ({
  value,
  handleNewTime
}: {
  value: string;
  handleNewTime: (time: string) => void;
}) => {
  const [editing, setEditing] = useState(!value);
  const handleChange = (startTime: MaterialUiPickersDate) => {
    if (startTime) {
      handleNewTime(startTime.format());
    }
    setEditing(false);
  };
  return editing ? (
    <TimePicker
      onClose={() => setEditing(false)}
      value={value}
      onChange={handleChange}
    />
  ) : (
    <Link style={{ cursor: "pointer" }} onClick={() => setEditing(true)}>
      <Typography variant="caption">
        {moment(value).format("h:mm a")}
      </Typography>
    </Link>
  );
};

export default TimeDisplay;
