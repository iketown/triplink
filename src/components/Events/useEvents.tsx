import React, { useState, useEffect, useMemo } from "react";
import useAuth from "../Account/UserCtx";
import { useFirebaseCtx } from "../Firebase";
import moment from "moment";
import { TourEvent, TimeItem, GeneralEvent } from "./event.types";
import { AirportResult } from "../../apis/amadeus.types";
import { amadeusFxns } from "../../apis/Amadeus";
//
//

const getHourRange = (events: any[]) => {
  let earliestHour = 24;
  let latestHour = 0;
  events.forEach(event => {
    const startHour = moment(event.startDate).hour();
    const endHour = moment(event.endDate).hour();
    if (event.allDay) return;
    if (startHour < earliestHour) earliestHour = startHour;
    if (startHour > latestHour) latestHour = startHour;
    if (endHour > latestHour) latestHour = endHour;
    if (endHour < earliestHour) earliestHour = endHour;
  });
  return { earliestHour, latestHour };
};

export const useTimeRangeEvents = (after: string, before: string) => {
  const [events, setEvents] = useState<GeneralEvent[]>([]);
  const { userProfile } = useAuth();
  const { firestore } = useFirebaseCtx();

  useEffect(() => {
    if (userProfile && after && before) {
      const eventsRef = firestore
        .collection(`/accounts/${userProfile.currentAccount}/events`)
        .where("startDate", ">=", after)
        .where("startDate", "<=", before);

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
  }, [firestore, before, after, userProfile]);
  return { events };
};

export const useMonthEvents = (month: string) => {
  const [events, setEvents] = useState<GeneralEvent[]>();
  const [hourRange, setHourRange] = useState({
    earliestHour: 1,
    latestHour: 24
  });

  const { userProfile } = useAuth();
  const { firestore } = useFirebaseCtx();

  useEffect(() => {
    if (userProfile) {
      const eventsRef = firestore
        .collection(`/accounts/${userProfile.currentAccount}/events`)
        .where("startDate", ">=", month)
        .where(
          "startDate",
          "<=",
          moment(month)
            .add(1, "month")
            .format()
        );

      const unsubscribe = eventsRef.onSnapshot(snapshot => {
        console.log("updating EVENTS");
        const _events: any = [];
        snapshot.forEach(doc => {
          _events.push({ ...doc.data(), id: doc.id });
        });
        setHourRange(getHourRange(_events));
        setEvents(
          _events.sort((a: any, b: any) => (a.startTime < b.startTime ? -1 : 1))
        );
      });
      return unsubscribe;
    }
  }, [firestore, month, userProfile]);
  return { events, hourRange };
};

export const useEvents = (tourId: string) => {
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [hourRange, setHourRange] = useState({
    earliestHour: 1,
    latestHour: 24
  });
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
          const { startDate, endDate } = doc.data();

          _events.push({ ...doc.data(), id: doc.id });
        });
        setHourRange(getHourRange(_events));
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
  const {
    doCreateEvent,
    doEditEvent,
    doCreateLocation,
    doUpdateTour
  } = useFirebaseCtx();

  const handleEventSubmit = async (
    values: any,
    callback?: () => void,
    newTourBoundaries?: { startDate: string; endDate: string }
  ) => {
    console.log("new Tour Boundaries", newTourBoundaries);
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
    //@ts-ignore
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
    const { startDate, startTime, tourId, memberIds = [] } = values;
    if (values.id) {
      //@ts-ignore
      await doEditEvent({
        startDate,
        startTime,
        locBasic,
        tourId,
        memberIds,
        id: values.id
      });
    } else {
      //@ts-ignore
      await doCreateEvent({
        startDate,
        startTime,
        locBasic,
        tourId,
        memberIds
      });
    }
    if (newTourBoundaries) {
      doUpdateTour(tourId, newTourBoundaries);
    }
    callback && callback();
  };

  return { handleEventSubmit };
};

export const useEventTimeItems = (eventId?: string) => {
  const { getEventsRef, doUpdateEventTimeItem } = useFirebaseCtx();
  const [timeItems, setTimeItems] = useState<TimeItem[]>([]);

  useEffect(() => {
    let unsubscribe;
    const startListener = async () => {
      if (!eventId) return;
      const eventsRef = await getEventsRef();
      const timeItemsRef =
        eventsRef && eventsRef.doc(eventId).collection("timeItems");
      unsubscribe =
        timeItemsRef &&
        timeItemsRef.onSnapshot(snapshot => {
          let _timeItems: TimeItem[] = [];
          if (!snapshot.empty) {
            snapshot.forEach(doc => {
              //@ts-ignore
              _timeItems.push({ ...doc.data(), id: doc.id });
            });
            setTimeItems(
              _timeItems.sort((a: TimeItem, b: TimeItem) => {
                if (a.startTime < b.startTime) return -1;
                else return 1;
              })
            );
          }
        });
    };
    startListener();
    return unsubscribe;
  }, [eventId]);

  const changeTimeItemPeople = (
    timeItemId: string,
    people: string[],
    adding?: boolean
  ) => {
    if (!eventId || !timeItemId) return null;
    const timeItem = timeItems.find(ti => ti.id === timeItemId);
    const currentTIP = (timeItem && timeItem.people) || [];
    let newTIP;
    if (adding) {
      newTIP = Array.from(new Set([...currentTIP, ...people]));
    } else {
      newTIP = currentTIP.filter(personId => !people.includes(personId));
    }
    const timeItemInfo = {
      people: newTIP
    };
    doUpdateEventTimeItem(eventId, timeItemId, timeItemInfo);
  };

  return { timeItems, changeTimeItemPeople };
};
