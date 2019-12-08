import React, { Fragment } from "react";
import { Grid } from "@material-ui/core";
import EventWhereCard from "../ScheduleFormComponents/EventWhereCard";
import EventWhenCard from "../ScheduleFormComponents/EventWhenCard";
import { Half } from "../EventForm";
import EventPeopleList from "../ScheduleFormComponents/EventPeopleList";

const ShowForm = () => {
  return (
    <Fragment>
      <Half>
        <EventWhereCard />
      </Half>
      <Half>
        <EventWhenCard />
        <EventPeopleList />
      </Half>
    </Fragment>
  );
};

export default ShowForm;
