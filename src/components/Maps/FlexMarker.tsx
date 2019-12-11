import React from "react";
import { Marker, MarkerProps } from "@react-google-maps/api";
import { useMapCtx } from "./MapCtx";
import { LocationType } from "../Locations/location.types";

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
}

export const FlexMarker = ({
  color = "blue-dot",
  loc,
  ...markerProps
}: FlexMarkerProps) => {
  const { selectedId } = useMapCtx();
  const selected = loc && loc.eventId && selectedId === loc.eventId;
  return (
    <Marker
      {...markerProps}
      icon={markerColorUrl(selected ? "orange-dot" : color)}
    />
  );
};

export default FlexMarker;
