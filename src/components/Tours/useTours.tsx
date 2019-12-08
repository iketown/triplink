import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useFirebaseCtx } from "../Firebase";
import useAuth from "../Account/UserCtx";
import { Tour } from "./types";
import { usePeople } from "../People/usePeople";
import { getArrayOfDates } from "../../utils/dateFxns";
import moment from "moment";
import { MaterialUiPickersDate } from "@material-ui/pickers";

export const useToursTimeRange = () => {
  const { firestore } = useFirebaseCtx();
  const { userProfile } = useAuth();
  const [earliestDate, setEarliestDate] = useState(
    moment()
      .subtract(2, "months")
      .format()
  );
  const [toursAfterDate, setToursAfterDate] = useState<Tour[]>();

  const setEarliestEndDate = (newDate: string) => {
    if (earliestDate && newDate && newDate < earliestDate) {
      // if its not earlier, just leave it alone
      setEarliestDate(newDate);
    }
  };

  const tourDatesObj = useMemo(() => {
    if (!toursAfterDate || !toursAfterDate.length) return null;
    console.log("creating tourDatesObj");
    const _tourDatesObj = toursAfterDate.reduce(
      (
        obj: {
          [date: string]: { id: string; name: string };
        },
        tour
      ) => {
        const dateArr = getArrayOfDates({
          first: tour.startDate,
          last: tour.endDate
        });
        dateArr.forEach(date => {
          obj[date.format("YYYY-MM-DD")] = { id: tour.id, name: tour.name };
        });
        return obj;
      },
      {}
    );
    return _tourDatesObj;
  }, [toursAfterDate]);

  useEffect(() => {
    if (userProfile && earliestDate) {
      const toursBMRef = firestore
        .collection(`accounts/${userProfile.currentAccount}/tours`)
        .where("endDate", ">=", earliestDate);
      console.log("calling firestore");

      const unsubscribe = toursBMRef.onSnapshot(docs => {
        const _tours: Tour[] = [];
        if (!docs.empty) {
          docs.forEach(doc => {
            //@ts-ignore
            _tours.push({ ...doc.data(), id: doc.id });
          });
          //@ts-ignore
          setToursAfterDate(_tours);
        }
      });

      return unsubscribe;
    }
  }, [earliestDate, userProfile]);

  const shouldDisableStartdate = (day: MaterialUiPickersDate) => {
    if (day && day.isBefore(earliestDate)) {
      setEarliestEndDate(day.format());
    }
    if (tourDatesObj && day) {
      if (tourDatesObj[day.format("YYYY-MM-DD")]) {
        return true;
      }
    }
    return false;
  };

  const shouldDisableTourStartDate = (
    day: MaterialUiPickersDate,
    tourId: string
  ) => {
    if (day && day.isBefore(earliestDate)) {
      setEarliestEndDate(day.format());
    }
    if (tourDatesObj) {
      // this tour boundaries
      const thisTourFirstDateIndex = Object.entries(tourDatesObj).findIndex(
        ([date, { id, name }]) => id === tourId
      );
      // previous tour endDate
      const prevTourLastIndex = thisTourFirstDateIndex - 1;
      // next tour startDate
    }
  };

  return {
    toursAfterDate,
    setEarliestEndDate,
    tourDatesObj,
    earliestDate,
    shouldDisableStartdate
  };
};

export const useFutureTours = () => {
  const [futureTours, setFutureTours] = useState<Tour[]>([]);
  const { firestore } = useFirebaseCtx();
  const { userProfile } = useAuth();
  useEffect(() => {
    if (userProfile) {
      const toursRef = firestore
        .collection(`accounts/${userProfile.currentAccount}/tours`)
        .where("endDate", ">=", moment().format("YYYY-MM-DD"));
      const unsubscribe = toursRef.onSnapshot(querySnapshot => {
        const _myTours: Tour[] = [];
        querySnapshot.forEach(doc => {
          // @ts-ignore
          _myTours.push({ ...doc.data(), id: doc.id });
        });
        setFutureTours(
          _myTours.sort((a, b) => {
            if (a.startDate < b.startDate) return -1;
            return 1;
          })
        );
      });
      return unsubscribe;
    }
  }, [userProfile, firestore]);

  return { futureTours };
};

export const useTours = (
  targetDate: string = moment().format(),
  dayRange: number = 60
) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const { firestore } = useFirebaseCtx();
  const { userProfile } = useAuth();
  useEffect(() => {
    if (userProfile) {
      let toursRef;
      if (targetDate) {
        const earliestStartDate = moment(targetDate)
          .subtract(dayRange, "days")
          .format();
        const latestStartDate = moment(targetDate)
          .add(dayRange, "days")
          .format();
        toursRef = firestore
          .collection(`accounts/${userProfile.currentAccount}/tours`)
          .where("startDate", "<=", latestStartDate)
          .where("startDate", ">=", earliestStartDate);
      } else {
        toursRef = firestore.collection(
          `accounts/${userProfile.currentAccount}/tours`
        );
      }
      //TODO this will need to be scoped at some point.  cant download every tour every time.  (-2months -> +10months?  beyond that selectable from checkbox?)

      const unsubscribe = toursRef.onSnapshot(querySnapshot => {
        const _myTours: Tour[] = [];
        querySnapshot.forEach(doc => {
          // @ts-ignore
          _myTours.push({ ...doc.data(), id: doc.id });
        });
        setTours(
          _myTours.sort((a, b) => {
            if (a.startDate < b.startDate) return -1;
            return 1;
          })
        );
      });
      return unsubscribe;
    }
  }, [userProfile, firestore]);

  return { tours };
};

export const useTour = (tourId: string) => {
  const [tour, setTour] = useState<Tour>();
  const { getTourRef } = useFirebaseCtx();
  useEffect(() => {
    let unsubscribe = () => {};
    async function tourListener() {
      const tourRef = await getTourRef(tourId);
      if (tourRef) {
        unsubscribe = tourRef.onSnapshot(doc => {
          //@ts-ignore
          setTour({ ...doc.data(), id: doc.id });
        });
      }
    }
    tourListener();
    return unsubscribe;
  }, []);
  return { tour };
};
