export type Tour = {
  createdBy: string;
  name: string;
  startDate: string;
  endDate: string;
  id: string;
  subTours: { startTimes: string[] };
  tourMembers: string[];
};

export interface ITourTable {
  tour: Tour;
}
