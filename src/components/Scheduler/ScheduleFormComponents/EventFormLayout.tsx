import React from "react";
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";

const EventFormLayout = (props: AppointmentForm.LayoutProps) => {
  console.log("layout props", props);
  return <AppointmentForm.Layout {...props} />;
};

export default EventFormLayout;
