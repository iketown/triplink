import React, { memo } from "react";
import { Typography } from "@material-ui/core";
import moment from "moment";

const propsEqual = (prev: any, next: any) => {
  return prev.dayMarkers === next.dayMarkers;
};
const GridLabels = memo(
  ({
    dayMarkers
  }: {
    dayMarkers: {
      label: string;
      value: number;
      moment: moment.Moment;
      dayNumber: number;
    }[];
  }) => {
    return (
      <>
        {dayMarkers.map((dayMarker, index) => {
          const dayText = dayMarker.moment.format("MMM DD");
          return (
            <div key={index} style={{ gridRow: index + 1, gridColumn: 1 }}>
              <Typography variant="caption">{dayText}</Typography>
            </div>
          );
        })}
      </>
    );
  },
  propsEqual
);

export default GridLabels;
