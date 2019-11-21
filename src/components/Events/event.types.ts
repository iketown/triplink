import { LocBasicType } from "../Locations/location.types";

export type TourEvent = {
  id?: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  tourId: string;
  locBasic: LocBasicType;
  memberIds?: string[];
};

export type TimeItem = {
  startTime: string;
  title: string;
  id?: string;
  endTime?: string;
  people?: string[];
};
