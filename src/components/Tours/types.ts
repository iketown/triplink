export type Tour = {
  createdBy: string
  name: string
  startDate: string
  endDate: string
  id: string
  subTours: { startTimes: string[] }
}

export interface ITourTable {
  tour: Tour
}