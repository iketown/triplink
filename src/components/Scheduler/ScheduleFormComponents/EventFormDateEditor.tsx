import React from "react";
import { DateTimePicker } from "@material-ui/pickers";
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";

const EventFormDateEditor = (props: AppointmentForm.DateEditorProps) => {
  const { onValueChange, value, locale } = props;
  return <AppointmentForm.DateEditor {...props} />;
};

export default EventFormDateEditor;
