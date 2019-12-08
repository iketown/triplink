import React from "react";
import ShowMe from "../../../utils/ShowMe";
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import { Appointment } from "@devexpress/dx-react-scheduler";
import { TextField } from "@material-ui/core";
//
//
export const EventFormLabelEditor = (props: AppointmentForm.LabelProps) => {
  const { text } = props;
  switch (text) {
    case "Details":
    case "End repeat":
    case "More Information":
    case "Repeat":
      return null;
    default:
      return <AppointmentForm.Label {...props} />;
  }
};

const EventFormTextEditor = (props: AppointmentForm.TextEditorProps) => {
  const { onValueChange, value, type, placeholder } = props;
  switch (placeholder) {
    case "Notes":
      return null;
    default:
      return <AppointmentForm.TextEditor {...props} />;
  }
};

export default EventFormTextEditor;
