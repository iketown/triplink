import React, { useState, useEffect, useMemo } from "react";
import useAuth from "../Account/UserCtx";
import { useFirebaseCtx } from "../Firebase";
import moment from "moment";
import { TourEvent } from "./event.types";
import { AirportResult } from "../../apis/amadeus.types";
//
//

export const useEvents = (tourId: string) => {
  const [events, setEvents] = useState<TourEvent[]>([]);
  const { userProfile } = useAuth();
  const { firestore } = useFirebaseCtx();

  useEffect(() => {
    if (userProfile) {
      const eventsRef = firestore
        .collection(`/accounts/${userProfile.currentAccount}/events`)
        .where("tourId", "==", tourId);

      const unsubscribe = eventsRef.onSnapshot(snapshot => {
        console.log("updating EVENTS");
        const _events: any = [];
        snapshot.forEach(doc => {
          _events.push({ ...doc.data(), id: doc.id });
        });
        setEvents(
          _events.sort((a: any, b: any) => (a.startTime < b.startTime ? -1 : 1))
        );
      });
      return unsubscribe;
    }
  }, [firestore, tourId, userProfile]);

  const closeAirports: (AirportResult | undefined)[] = useMemo(() => {
    const _airports = events.map(event => event.locBasic.airport);
    return _airports.length ? _airports : [];
  }, [events]);

  const eventsObj = useMemo(() => {
    console.log("memoizing eventsObj");
    const _eventsObj = events.reduce(
      (
        obj: { [key: string]: TourEvent[] },
        event: TourEvent,
        index: number
      ) => {
        const date = moment(event.startTime).format("YYYY-MM-DD");
        if (!!obj[date]) obj[date].push(event);
        else obj[date] = [event];
        return obj;
      },
      {}
    );
    return _eventsObj;
  }, [events]);

  return { events, eventsObj, closeAirports };
};
