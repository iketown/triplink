import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardActions,
  Tab,
  Tabs,
  Typography,
  Box,
  Collapse,
  IconButton,
  Icon
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import moment from "moment";
import TourForm from "./TourForm";
import TourEvents from "../Events/TourEvents";
import TourPeople from "../People/TourPeople";
import TourSchedule from "./TourSchedule";
import { Tour } from "./types";
import styled from "styled-components";
import { TourTravels } from "../Travels/TourTravels";
import RotatingArrowButton from "../Cards/RotatingArrowButton";
import TourTable from "./TourTable";
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

export const TourCard = ({ tour }: { tour: Tour }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const handleSetTab = (e: React.ChangeEvent<{}>, index: number) => {
    setTabIndex(index);
  };
  const initialValues = {
    ...tour,
    startDate: moment(tour.startDate),
    endDate: moment(tour.endDate)
  };
  const tourItems = [
    <TourTable tour={tour} />,
    <TourForm initialValues={initialValues} />,
    <TourEvents tour={tour} />,
    <TourTravels tour={tour} />,
    <TourPeople tour={tour} />
  ];
  return (
    <Card style={{ marginBottom: "1rem" }}>
      <CardHeader
        title={tour.name}
        subheader={`${initialValues.startDate.format(
          "MMM DD"
        )} - ${initialValues.endDate.format(
          "MMM DD"
        )}, ${initialValues.endDate.format("YYYY")}`}
        titleTypographyProps={{ variant: "subtitle2" }}
        subheaderTypographyProps={{
          variant: "caption",
          color: "textSecondary"
        }}
        action={
          <RotatingArrowButton
            onClick={() => setExpanded(old => !old)}
            expanded={expanded}
            direction="ccw"
          />
        }
      />
      <Collapse in={expanded}>
        <Tabs style={{ flexGrow: 1 }} value={tabIndex} onChange={handleSetTab}>
          <Tab label={"Table"}></Tab>
          <Tab label={"General"}></Tab>
          <Tab label={"Events"}></Tab>
          <Tab label={"Travels"}></Tab>
          <Tab label={"People"}></Tab>
        </Tabs>
        {tourItems[tabIndex]}
      </Collapse>
    </Card>
  );
};

export const NewTourCard = () => {
  const defaultValues = {
    startDate: moment(),
    endDate: moment().add(1, "week"),
    name: ""
  };
  return (
    <Card style={{ maxWidth: "25rem" }}>
      <TourForm initialValues={defaultValues} />
    </Card>
  );
};
export default TourCard;
