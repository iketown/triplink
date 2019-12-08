import React from "react";
import { Full } from "../EventForm";
import { useFormCtx } from "./FormCtx";
import { TextField } from "@material-ui/core";

//
//
const EventTitleCard = () => {
  const { data, handleFieldChange } = useFormCtx();

  return (
    <Full>
      <TextField
        label="title"
        fullWidth
        variant="outlined"
        value={data.title}
        onChange={e => handleFieldChange("title", e.target.value)}
      />
    </Full>
  );
};

export default EventTitleCard;
