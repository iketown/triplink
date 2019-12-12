import React, { useEffect, useMemo } from "react";
import GoogMap from "./GoogMap";
import { GeneralEvent } from "../Events/event.types";

//
//
const GoogMapEvents = ({ events }: { events?: GeneralEvent[] }) => {
  const gigs = useMemo(() => {
    return events && events.filter(event => event.eventType === "show");
  }, [events]);
  const flights = useMemo(() => {
    return events && events.filter(event => event.eventType === "flight");
  }, [events]);

  if (!events) return <div>no events ...</div>;
  return (
    <GoogMap
      flights={flights}
      gigs={gigs}
      boundsPoints={gigs && gigs.map(gig => gig.startLoc)}
    />
  );
};

export default GoogMapEvents;
