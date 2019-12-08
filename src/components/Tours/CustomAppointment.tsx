import React from "react";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import { FaStar } from "react-icons/fa";
import moment from "moment-timezone";
import { Typography } from "@material-ui/core";

const eventColor = (eventType: string) => {
  switch (eventType) {
    case "show":
      return "blue";
    default:
      return "navyblue";
  }
};

const CustomAppointment = ({
  children,
  data,
  ...restProps
}: Appointments.AppointmentProps) => {
  const { eventType } = data;
  const newData = { ...data };
  const timeZone = data.startLoc && data.startLoc.timeZoneId;
  if (!timeZone) return null;
  const myOffset = new Date().getTimezoneOffset();
  const eventOffset = -moment(data.startDate)
    .tz(timeZone)
    .utcOffset();
  let timeZoneWarning;
  if (myOffset !== eventOffset) {
    // handle different timezone
    newData.startDate = moment(newData.startDate)
      .add(myOffset - eventOffset, "minutes")
      .toDate();
    newData.endDate = moment(newData.endDate)
      .add(myOffset - eventOffset, "minutes")
      .toDate();
    timeZoneWarning = `*timezone: ${data.startLoc.timeZoneId}`;
  }
  return (
    <Appointments.Appointment
      {...restProps}
      data={newData}
      style={{
        backgroundColor: eventColor(eventType)
      }}
    >
      {children}
    </Appointments.Appointment>
  );
};

export default CustomAppointment;
