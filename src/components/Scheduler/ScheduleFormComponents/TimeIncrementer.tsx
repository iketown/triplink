import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  Card
} from "@material-ui/core";

const TimeIncrementer = ({
  minutes,
  setMinutes
}: {
  minutes: number;
  setMinutes: (min: number) => void;
}) => {
  const handleIncrement15 = (up?: boolean) => {
    let newValue = Math.round(minutes / 5) * 5;
    if (up) {
      newValue += 15;
    } else {
      newValue -= 15;
    }
    setMinutes(newValue > 0 ? newValue : 0);
  };
  return (
    <Card
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px"
      }}
    >
      <Button
        onClick={() => handleIncrement15(false)}
        size="small"
        variant="outlined"
      >
        -15
      </Button>
      <div style={{ textAlign: "center" }}>
        <Typography variant="caption" color="textSecondary">
          duration:
        </Typography>
        <Typography>
          <b>{minutes}</b> minutes
        </Typography>
      </div>
      <Button
        onClick={() => handleIncrement15(true)}
        size="small"
        variant="outlined"
      >
        +15
      </Button>
    </Card>
  );
  return (
    <TextField
      label="duration"
      value={minutes}
      type="number"
      onChange={e => {
        setMinutes(Number(e.target.value));
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Button size="small" variant="outlined">
              -15
            </Button>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Button size="small" variant="outlined">
              +15
            </Button>
          </InputAdornment>
        )
      }}
    />
  );
};

export default TimeIncrementer;
