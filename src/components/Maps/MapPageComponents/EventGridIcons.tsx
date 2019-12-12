import React from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import { GeneralEvent } from "../../Events/event.types";
import { useMapCtx } from "../MapCtx";
import { FaPlane, FaStar } from "react-icons/fa";
import { unixToDay } from "../mapHelpers";
import moment from "moment";
//
//
const EventGridIcons = ({ events }: { events: GeneralEvent[] }) => {
  const { selectedId, setSelectedId } = useMapCtx();
  return (
    <>
      {events &&
        events.map(event => {
          let colNum;
          let icon = <div />;
          let title = "";
          const selected = selectedId === event.id;
          if (event.eventType === "flight") {
            colNum = 4;
            icon = <FaPlane />;
            title = `${event.startLoc.iataCode} - ${event.endLoc &&
              event.endLoc.iataCode}`;
          }
          if (event.eventType === "show") {
            colNum = 5;
            icon = <FaStar color={selected ? "orange" : "darkgrey"} />;
            title = `${event.startLoc.shortName} ${moment(
              event.startDate
            ).format("MM.DD")}`;
          }
          const dayNumber = unixToDay(moment(event.startDate).unix());
          const gridRow = `day${dayNumber}`;
          return (
            <Tooltip key={event.id} placement="right" title={title}>
              <IconButton
                size="small"
                style={{
                  gridColumn: colNum,
                  gridRow,
                  opacity: 0.6
                }}
                onClick={() => event.id && setSelectedId(event.id)}
              >
                {icon}
              </IconButton>
            </Tooltip>
          );
        })}
    </>
  );
};

export default EventGridIcons;
