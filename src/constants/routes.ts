import {
  Home,
  VerifiedUser,
  Person,
  Star,
  People,
  Map,
  SvgIconComponent
} from "@material-ui/icons";

import LandingPage from "../components/Landing/Landing";
import SignUpPage from "../components/SignUp/SignUp";
import SignInPage from "../components/SignIn/SignIn";
import Day from "../components/Day/Day";
import PasswordForgetPage from "../components/PasswordForget/PasswordForget";
import HomePage from "../components/Home/Home";
import AccountPage from "../components/Account/Account";
import AdminPage from "../components/Admin/Admin";
import PeoplePage from "../components/People/People";
import ToursPage from "../components/Tours/Tours";
import EventsPage from "../components/Events/Events";
import TravelsPage from "../components/Travels/Travels";
import { RouteComponentProps } from "react-router";
import { FaSun } from "react-icons/fa";
import moment from "moment";
import Timeline from "../components/Timeline/TimelineVis";
import TourSchedule from "../components/Tours/TourSchedule";
import FlightGrid from "../components/Scheduler/FlightGrid";
type Route = {
  name: string;
  route: string;
  linkRoute?: string;
  Icon: SvgIconComponent;
  component: (props: RouteComponentProps) => JSX.Element;
  exact?: boolean;
};

export const routes = {
  signIn: "/signin",
  landing: "/",
  home: "/home",
  account: "/account",
  admin: "/admin",
  tours: "/tours",
  events: "/events",
  travel: "/travel",
  people: "/people",
  day: "/day/:date",
  timeline: "/timeline/:date",
  calendar: "/calendar",
  grid: "/grid"
};

export const signedOutRoutes: Route[] = [
  {
    name: "Landing",
    route: routes.landing,
    Icon: Home,
    component: LandingPage,
    exact: true
  },
  {
    name: "Sign In",
    route: routes.signIn,
    Icon: VerifiedUser,
    component: SignInPage
  },
  { name: "Home", route: routes.home, Icon: Home, component: HomePage }
];

export const signedInRoutes: Route[] = [
  {
    name: "Account",
    route: routes.account,
    Icon: Person,
    component: AccountPage
  },
  { name: "Admin", route: routes.admin, Icon: Home, component: AdminPage }
];

export const appRoutes: Route[] = [
  {
    name: "Calendar",
    route: routes.calendar,
    Icon: Star,
    component: TourSchedule
  },
  { name: "Tours", route: routes.tours, Icon: Star, component: ToursPage },
  { name: "Travel", route: routes.travel, Icon: Map, component: TravelsPage },
  { name: "Events", route: routes.events, Icon: Star, component: EventsPage },
  { name: "People", route: routes.people, Icon: People, component: PeoplePage },
  { name: "Grid", route: routes.grid, Icon: Star, component: FlightGrid }
  // {
  //   name: "Day Sheet",
  //   route: routes.day,
  //   linkRoute: `/day/${moment().format("YYYY-MM-DD")}`,
  //   Icon: FaSun,
  //   component: Day,
  //   exact: true
  // },
  // {
  //   name: "Timeline",
  //   route: routes.timeline,
  //   linkRoute: `/timeline/${moment().format("YYYY-MM-DD")}`,
  //   Icon: FaSun,
  //   component: Timeline
  // }
];
