import React from "react";
import { LocBasicType } from "../Locations/location.types";
import {
  FaStar,
  FaCalendarAlt,
  FaHotel,
  FaPlane,
  FaBusAlt
} from "react-icons/fa";
import { EventTypes } from "../Events/event.types";
import { IconType } from "react-icons/lib/cjs";
import FlightForm from "./EventForms/FlightForm";
import GenericForm from "./EventForms/GenericForm";
import GroundForm from "./EventForms/GroundForm";
import HotelForm from "./EventForms/HotelForm";
import ShowForm from "./EventForms/ShowForm";

export type FormData = {
  eventType?: EventTypes;
  title?: string;
  startLoc?: LocBasicType;
  endLoc?: LocBasicType;
  startDate?: string;
  endDate?: string;
};

export const formValidator = (data: FormData) => {
  const errors: { [field: string]: string } = {};
  const messages = {
    title: "Please choose a title",
    startLoc: "Please choose a location",
    endLoc: "Please choose an ending Location",
    startDate: "Please choose a Start Date",
    endDate: "Please choose an End Date"
  };
  const alwaysRequired = ["title", "startLoc", "startDate"];
  const requiredFields = {
    show: [...alwaysRequired],
    generic: [...alwaysRequired],
    travel: [...alwaysRequired, "endLoc", "endDate"],
    hotel: [...alwaysRequired]
  };
  if (!data.eventType) return { isValid: false, errors: {} };
  // requiredFields[data.eventType].forEach((reqField: any) => {
  //   //@ts-ignore
  //   if (!data[reqField]) errors[reqField] = messages[reqField];
  // });
  const isValid = !Object.keys(errors).length;
  console.log({ isValid, errors });
  return { isValid, errors };
};

export const eventTypes: {
  [name: string]: { label: string; Icon: IconType; form: JSX.Element };
} = {
  show: { label: "Show", Icon: FaStar, form: <ShowForm /> },
  generic: { label: "Generic", Icon: FaCalendarAlt, form: <GenericForm /> },
  flight: { label: "Flight", Icon: FaPlane, form: <FlightForm /> },
  ground: { label: "Ground", Icon: FaBusAlt, form: <GroundForm /> },
  hotel: { label: "hotel", Icon: FaHotel, form: <HotelForm /> }
};
