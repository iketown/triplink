import React, { Fragment } from "react";
import EventWhereCard from "../ScheduleFormComponents/EventWhereCard";
import EventWhenCard from "../ScheduleFormComponents/EventWhenCard";
import { Half, Full } from "../EventForm";
import { TextField } from "@material-ui/core";
import EventTitleCard from "../ScheduleFormComponents/EventTitleCard";
import EventPeopleList from "../ScheduleFormComponents/EventPeopleList";
//
//
const GenericForm = () => {
  return (
    <Fragment>
      <Full>
        <EventTitleCard />
      </Full>
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

export default GenericForm;
