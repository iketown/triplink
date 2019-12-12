import React, { memo } from "react";
import { Marker, MarkerProps } from "@react-google-maps/api";
import { useMapCtx } from "./MapCtx";
import { LocationType } from "../Locations/location.types";
import { GeneralEvent } from "../Events/event.types";
import moment from "moment";
import { FaStar } from "react-icons/fa";
// info -> https://sites.google.com/site/gmapsdevelopment/

type ColorString =
  | "yellow"
  | "yellow-dot"
  | "blue"
  | "blue-dot"
  | "green"
  | "green-dot"
  | "lightblue"
  | "ltblue-dot"
  | "orange"
  | "orange-dot"
  | "pink"
  | "pink-dot"
  | "purple"
  | "purple-dot"
  | "red"
  | "red-dot";

const markerColorUrl = (color: ColorString) =>
  `http://maps.google.com/mapfiles/ms/micons/${color}.png`;

interface FlexMarkerProps extends MarkerProps {
  color?: ColorString;
  loc?: any;
  selected?: boolean;
  event?: GeneralEvent;
}

const goldStar = {
  path: "m48,234 73-226 73,226-192-140h238z",
  fillColor: "yellow",
  fillOpacity: 1,
  scale: 0.1
  // strokeColor: "black",
  // strokeWeight: 1
};
export const FlexMarkerContainer = ({
  color = "blue-dot",
  loc,
  event,
  ...markerProps
}: FlexMarkerProps) => {
  const getIcon = () => {
    const defaultUrl = `http://labs.google.com/ridefinder/images/mm_20_blue.png`;
    if (!event) return defaultUrl;
    switch (event.eventType) {
      case "show":
        return `http://labs.google.com/ridefinder/images/mm_20_blue.png`;
      default:
        return defaultUrl;
    }
  };
  const getSelectedIcon = () => {
    const defaultUrl = `http://labs.google.com/ridefinder/images/mm_20_orange.png`;
    if (!event) return defaultUrl;
    switch (event.eventType) {
      case "show":
        return `http://maps.google.com/mapfiles/ms/micons/orange-dot.png`;
      default:
        return defaultUrl;
    }
  };

  const { selectedId, setSelectedId } = useMapCtx();
  const selected = event && event.id === selectedId;
  const title =
    event && event.eventType === "show"
      ? `${moment(event.startDate).format("MM.D")} ${event.startLoc.shortName ||
          event.startLoc.venueName}`
      : "";
  return (
    <Marker
      {...markerProps}
      // label={"hey label"}
      title={title}
      onClick={() => event && event.id && setSelectedId(event.id)}
      icon={selected ? getSelectedIcon() : getIcon()}
      zIndex={selected ? 2 : 1}
    />
  );
};

export default FlexMarkerContainer;
