import React, { useState } from "react";
import RecentLocList from "./RecentLocList";
import { useFormCtx } from "./FormCtx";
import EventCard from "./EventCard";
import { Collapse } from "@material-ui/core";
import GoogMap from "../../Maps/GoogMap";
//
//

const EventWhereCard = () => {
  const { data } = useFormCtx();
  const [expanded, setExpanded] = useState(!data.startLoc);
  return (
    <>
      <EventCard
        category="where"
        {...{ expanded, setExpanded }}
        title={data.startLoc ? data.startLoc.shortName : "where?"}
        subheader={data.startLoc && data.startLoc.venueName}
        content={<RecentLocList onChooseLoc={() => setExpanded(false)} />}
        extraContent={
          <Collapse in={!expanded}>
            {data.startLoc && <GoogMap markerLocs={[data.startLoc]} />}
          </Collapse>
        }
      />
    </>
  );
};

export default EventWhereCard;
