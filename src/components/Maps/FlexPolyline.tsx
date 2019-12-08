import React from "react";
import { Polyline, PolylineProps, Polygon } from "@react-google-maps/api";

interface PolyLinePropsExtended extends PolylineProps {}

const FlexPolyline = (props: PolyLinePropsExtended) => {
  const { path } = props;
  const arrow = {};
  return (
    <Polyline
      {...{ path }}
      options={{
        strokeWeight: 1,
        strokeColor: "grey",
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
