import React from "react";
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import { IconButton } from "@material-ui/core";
import { Button } from "@material-ui/core";

//
//
const EventFormCommand = (
  props: AppointmentForm.CommandLayoutProps,
  ...otherProps: any
) => {
  console.log("event command props", props, otherProps);
  return <div></div>;
};

const EventFormButton = (props: AppointmentForm.CommandButtonProps) => {
  return <Button onClick={props.onExecute}>hi</Button>;
};

export default EventFormCommand;
