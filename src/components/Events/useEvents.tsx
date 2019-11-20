import React, { useState, useEffect, useMemo } from "react";
import useAuth from "../Account/UserCtx";
import { useFirebaseCtx } from "../Firebase";
import moment from "moment";
import { TourEvent } from "./event.types";
import { AirportResult } from "../../apis/amadeus.types";
import { amadeusFxns } from "../../apis/Amadeus";
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

export const useEventFxns = () => {
  const { getAirportsNearPoint } = amadeusFxns();
  const { doCreateEvent, doEditEvent, doCreateLocation } = useFirebaseCtx();

  const handleEventSubmit = async (values: any, callback?: () => void) => {
    // save location
    let airportsAll = await getAirportsNearPoint(
      values.location.lat,
      values.location.lng
    );
    if (!airportsAll) airportsAll = [];
    const locResponse = await doCreateLocation({
      ...values.location,
      airports: (airportsAll && airportsAll.slice(0, 3)) || []
    }).catch(err => console.log("error submitting LOCATION", err));
    if (!locResponse) return { error: "some kind of error" };
    const {
      id,
      lat,
      lng,
      venueName,
      address,
      timeZoneId,
      shortName,
      placeId
    } = locResponse;
    const locBasic = {
      id,
      lat,
      lng,
      venueName,
      address,
      timeZoneId,
      shortName,
      placeId,
      airport: airportsAll[0]
    };
    // save event with minimal location info and locId
    const { startDate, startTime, tourId, subTourIndex } = values;
    if (values.id) {
      //@ts-ignore
      await doEditEvent({
        startDate,
        startTime,
        locBasic,
        tourId,
        subTourIndex,
        id: values.id
      });
    } else {
      //@ts-ignore
      await doCreateEvent({
        startDate,
        startTime,
        locBasic,
        tourId,
        subTourIndex
      });
    }
    callback && callback();
  };

  return { handleEventSubmit };
};
