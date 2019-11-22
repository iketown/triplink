import React, { createContext, useContext, useMemo } from "react";
import { useEvents, useEventTimeItems } from "./useEvents";
import { TimeItem, TourEvent } from "./event.types";

type EventCtxType = {
  event: TourEvent;
  timeItems: TimeItem[];
};
//@ts-ignore
const EventCtx = createContext<EventCtxType>();

interface IEventCtxProvider {
  eventId: string;
  tourId: string;
  children: any;
}

export const EventCtxProvider = ({
  eventId,
  tourId,
  children
}: IEventCtxProvider) => {
  const { eventsObj, events } = useEvents(tourId);
  const { timeItems } = useEventTimeItems(eventId);
  const event = useMemo(() => {
    return events.find(e => e.id && e.id === eventId);
  }, [eventId, events]);
  return <EventCtx.Provider value={{ event, timeItems }} children={children} />;
};

export const useEventCtx = () => {
  const ctx = useContext(EventCtx);
  if (!ctx)
    throw new Error("useEventCtx must be a descendant of EventCtxProvider");
  //@ts-ignore
  const { event, timeItems } = ctx;
  return { event, timeItems };
};
