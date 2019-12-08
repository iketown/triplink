import React, { useState } from "react";
import {
  ListItemIcon,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
  ListItemSecondaryAction
} from "@material-ui/core";
import { Timer, Save, ArrowRight } from "@material-ui/icons";
import { useEventFxns } from "../../../Events/useEvents";
import { useEventCtx } from "../../../Events/EventCtx";
import { useFirebaseCtx } from "../../../Firebase";
import { TimeItem } from "../../../Events/event.types";
import TimeDisplay from "./TimeDisplay";
import { Form, Field } from "react-final-form";
import TextInput from "../TextInput";
import { useTour } from "../../../Tours/useTours";
//
//

const NewTimeItem = ({ newItemTime }: { newItemTime: string }) => {
  const [title, setTitle] = useState("");
  const { event } = useEventCtx();
  const { doCreateEventTimeItem } = useFirebaseCtx();
  const { tour } = useTour(event.tourId);
  const validate = (values: any | {}) => {
    const errors: any = {};
    if (!values.title) errors.title = "Please add a Title";
    return errors;
  };
  const handleSave = (values: any) => {
    console.log("values", values);
    if (tour && tour.tourMembers) {
      values.people = tour.tourMembers;
      //TODO or create a default group for new items
    }
    doCreateEventTimeItem(event.id, values);
  };
  return (
    <Form
      onSubmit={handleSave}
      initialValues={{ startTime: newItemTime }}
      validate={validate}
    >
      {({ handleSubmit, form }) => {
        const submitAndReset = (e: any) => {
          e.stopPropagation();
          handleSubmit();
          form.reset();
        };
        return (
          <ListItem>
            <ListItemIcon>
              <Field name="startTime">
                {({ input }) => {
                  return (
                    <TimeDisplay
                      value={input.value}
                      handleNewTime={time => input.onChange(time)}
                    />
                  );
                }}
              </Field>
            </ListItemIcon>
            <TextInput
              name="title"
              label="add Item To Schedule"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={submitAndReset}>
                      <ArrowRight />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </ListItem>
        );
      }}
    </Form>
  );
};

export default NewTimeItem;
