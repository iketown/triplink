import { LocationType } from "../Locations/location.types";
import { AirportResult, Airport } from "../../apis/amadeus.types";
export type Person = {
  firstName: string;
  lastName: string;
  displayName: string;
  avatarURL: string;
  avatarPublicId: string;
  email: string;
  phone1?: string;
  phone2?: string;
  id: string;
  homeAddress?: LocationType;
  airports?: Airport[];
  homeAirports?: string[];
};

export type Group = {
  name: string;
  members?: string[];
  id?: string;
  colorIndex?: number | string;
};
