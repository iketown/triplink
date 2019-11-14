
import { LocBasicType } from '../Locations/location.types'


export type TourEvent = {
  id?: string
  startDate: string
  startTime: string
  endDate?: string
  tourId: string
  subTourIndex: number
  locBasic: LocBasicType
}