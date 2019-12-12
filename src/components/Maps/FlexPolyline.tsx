import React from "react";
import { Polyline, PolylineProps, Polygon } from "@react-google-maps/api";
import { useMapCtx } from "./MapCtx";
import { GeneralEvent } from "../Events/event.types";

//
//
interface PolyLinePropsExtended extends PolylineProps {
  eventId: string;
  path: { lat: number; lng: number }[];
  flight?: GeneralEvent;
}

const FlexPolyline = (props: PolyLinePropsExtended) => {
  const { path, eventId, flight } = props;

  const { selectedId, setSelectedId } = useMapCtx();
  const selected = selectedId === eventId;

  return (
    <Polyline
      {...{ path }}
      options={{
        strokeWeight: 1,
        strokeColor: selected ? "orange" : "grey",
        geodesic: true,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 2,
              strokeColor: "green"
            },
            offset: "0%"
          },
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              // scale: 2,
              strokeColor: "red"
            },
            offset: "100%"
          },
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              // scale: 2,
              strokeColor: "red"
            },
            offset: "33%"
          },
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              // scale: 2,
              strokeColor: "red"
            },
            offset: "66%"
          }
        ]
      }}
    ></Polyline>
  );
};

export default FlexPolyline;
