import { LocBasicType } from "../Locations/location.types";
import { eventTypes } from "../Scheduler/eventFormHelpers";

export type TourEvent = {
  id?: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  tourId: string;
  locBasic: LocBasicType;
  startLoc?: LocBasicType;
  memberIds?: string[];
};

export type TimeItem = {
  startTime: string;
  title: string;
  id?: string;
  endTime?: string;
  people?: string[];
};

export enum EventTypes {
  show = "show",
  generic = "generic",
  flight = "flight",
  hotel = "hotel",
  ground = "ground"
}

export type GeneralEvent = {
  eventType: EventTypes;
  id?: string;
  startDate: string;
  startTime: string;
  allDay?: boolean;
  endDate?: string;
  tourId: string;
  memberIds?: string[];
  locBasic?: LocBasicType;
  startLoc: LocBasicType;
  endLoc?: LocBasicType; // if travel
  itineraries?: string[];
};
