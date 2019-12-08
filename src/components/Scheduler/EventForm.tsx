import React, { useState, useEffect, createContext, useContext } from "react";
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import { TextField, Grid, Container } from "@material-ui/core";
import ShowMe from "../../utils/ShowMe";
import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment from "moment-timezone";
import GenEventForm from "./ScheduleFormComponents/GenEventForm";
import EventTypeSelect from "./ScheduleFormComponents/EventTypeSelect";
import EventTypeButtonRow from "./ScheduleFormComponents/EventTypeButtonRow";
import EventWhereCard from "./ScheduleFormComponents/EventWhereCard";
import EventWhenCard from "./ScheduleFormComponents/EventWhenCard";
import { FormCtxProvider } from "./ScheduleFormComponents/FormCtx";
import { eventTypes } from "./eventFormHelpers";
//
//

export const EventFormBasic = (props: AppointmentForm.BasicLayoutProps) => {
  const data = props.appointmentData;
  const { onFieldChange, appointmentData } = props;
  const handleFieldChange = (fieldName: string, newValue: any) => {
    onFieldChange({ [fieldName]: newValue });
  };

  return (
    <FormCtxProvider {...{ data: appointmentData, handleFieldChange }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EventTypeButtonRow
              value={data.eventType}
              onChange={(val: string) => {
                handleFieldChange("eventType", val);
              }}
            />
          </Grid>
          {data.eventType && eventTypes[data.eventType] ? (
            eventTypes[data.eventType].form
          ) : (
            <Grid item xs={12}>
              choose event type
            </Grid>
          )}
        </Grid>
        <ShowMe obj={data} name="data" />
      </Container>
    </FormCtxProvider>
  );
};

export default EventFormBasic;

export const Half = ({ children }: { children?: any }) => (
  <Grid item xs={12} sm={6}>
    {children}
  </Grid>
);
export const Full = ({ children }: { children?: any }) => (
  <Grid item xs={12}>
    {children}
  </Grid>
);
