import { auth } from "firebase/app";
import firebase from "firebase";
import { FirebaseDatabase } from "@firebase/database-types";
import "firebase/auth";
import { firebaseConfigDEV, firebaseConfig } from "./config";
import moment, { Moment } from "moment-timezone";
import { Airport, AirportResult } from "../../apis/amadeus.types";
import { LocationType } from "../Locations/location.types";
import { TourEvent, GeneralEvent } from "../Events/event.types";
import { Person } from "../People/people.types";
import { amadeusFxns } from "../../apis/Amadeus";
import { removeMissing } from "../../utils/general";
//
//
const config =
  process.env.NODE_ENV === "production" ? firebaseConfig : firebaseConfigDEV;

class Firebase {
  firestore: firebase.firestore.Firestore;
  auth: auth.Auth;
  db: firebase.database.Database;
  account: string;
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    this.auth = firebase.auth();
    this.db = firebase.database();
    this.firestore = firebase.firestore();
    this.account = "";
  }
  // util fxns //
  getUserProfile = () => {
    const uid = this.auth.currentUser && this.auth.currentUser.uid;
    return this.firestore
      .doc(`/userProfiles/${uid}`)
      .get()
      .then(doc => doc.data());
  };

  //
  doCreateUserWithEmailAndPassword = (email: string, password: string) => {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };
  doSignInWithEmailAndPassword = (email: string, password: string) => {
    return this.auth.signInWithEmailAndPassword(email, password);
  };
  doSignOut = () => this.auth.signOut();
  doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = (password: string) => {
    if (this.auth.currentUser) {
      return this.auth.currentUser.updatePassword(password);
    }
  };
  doUpdateProfile = (updateObj: any) => {
    const uid = this.auth.currentUser && this.auth.currentUser.uid;
    if (!uid) return null;
    const profileRef = this.firestore.doc(`userProfiles/${uid}`);
    return profileRef.update(updateObj);
  };
  // LOCATIONS //
  doCreateAirport = async (loc: LocationType) => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) {
      console.log("missing profile");
      return;
    }
    const locRef = this.firestore.collection(
      `accounts/${myProfile.currentAccount}/locations`
    );
    const apId = `airport_${loc.iataCode}`;
    await locRef
      .doc(apId)
      .set(loc, { merge: true })
      .catch(err => {
        console.log("error saving airport", err);
      });
    return (
      locRef
        .doc(apId)
        .get()
        //@ts-ignore
        .then((doc): LocationType => ({ ...doc.data(), id: doc.id }))
    );
  };
  doCreateLocation = async (loc: LocationType) => {
    if (loc.locType === "airport") return this.doCreateAirport(loc);
    const myProfile = await this.getUserProfile();
    if (!myProfile) {
      console.log("missing profile");
      return;
    }
    const locRef = this.firestore.collection(
      `accounts/${myProfile.currentAccount}/locations`
    );
    const previousLocs = await locRef
      .where("lat", "==", loc.lat)
      .where("lng", "==", loc.lng)
      .get()
      .then(snapshot => {
        if (snapshot.empty) return false;
        const _foundLocs: LocationType[] = [];
        snapshot.forEach(doc => {
          //@ts-ignore
          _foundLocs.push({ ...doc.data(), id: doc.id });
        });
        return _foundLocs;
      });

    if (previousLocs) {
      console.log("reusing prev LOC", loc);
      return previousLocs[0];
    } else {
      console.log("creating NEW LOC", loc);
      return locRef
        .add(loc)
        .then(doc => doc.get())
        .then(
          (doc): LocationType => {
            //@ts-ignore
            return { ...doc.data(), id: doc.id };
          }
        );
    }
  };

  // EVENTS //
  formatEventDates = (event: GeneralEvent) => {
    if (event.startDate) {
      event.startDate = moment(event.startDate).format();
    }
    if (event.endDate) {
      event.endDate = moment(event.endDate).format();
    }
    return event;
  };
  getEventsRef = async () => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    const eventsRef = this.firestore.collection(
      `accounts/${myProfile.currentAccount}/events`
    );
    return eventsRef;
  };
  doCreateEvent = async (event: GeneralEvent, expandTour?: boolean) => {
    const eventsRef = await this.getEventsRef();
    const formattedEvent = this.formatEventDates(event);
    // expand tour?
    if (event.startLoc) {
      const startLoc = await this.doCreateLocation(event.startLoc);
      console.log("startLoc populated", startLoc);
      //@ts-ignore
      if (startLoc) event.startLoc = startLoc;
    }
    if (event.endLoc) {
      const endLoc = await this.doCreateLocation(event.endLoc);
      console.log("endLoc populated", endLoc);
      //@ts-ignore
      if (endLoc) event.endLoc = endLoc;
    }
    return (
      eventsRef &&
      eventsRef.add({
        ...formattedEvent
      })
    );
  };

  doEditEvent = async (event: GeneralEvent, expandTour?: boolean) => {
    const eventsRef = await this.getEventsRef();
    const formattedEvent = this.formatEventDates(event);
    // expand tour??
    console.log("event in doEditEvent", event);
    if (event.startLoc) {
      const startLoc = await this.doCreateLocation(event.startLoc);
      console.log("startLoc populated", startLoc);
    }
    return (
      eventsRef &&
      eventsRef.doc(event.id).update({
        ...formattedEvent
      })
    );
  };
  doDeleteEvent = async (eventId: string) => {
    const eventsRef = await this.getEventsRef();
    return eventsRef && eventsRef.doc(eventId).delete();
  };

  doCreateEventTimeItem = async (eventId: string, timeItemInfo: any) => {
    const eventsRef = await this.getEventsRef();
    const timeItemsRef =
      eventsRef && eventsRef.doc(eventId).collection("timeItems");
    return timeItemsRef && timeItemsRef.add(timeItemInfo);
  };
  private getEventTimeItemRef = async (eventId: string, timeItemId: string) => {
    const eventsRef = await this.getEventsRef();
    const timeItemRef =
      eventsRef &&
      eventsRef
        .doc(eventId)
        .collection("timeItems")
        .doc(timeItemId);
    return timeItemRef;
  };
  doTogglePersonInEventTimeItem = async (
    eventId: string,
    timeItemId: string,
    personId: string,
    checked: boolean
  ) => {
    const eventTimeItemRef = await this.getEventTimeItemRef(
      eventId,
      timeItemId
    );
    eventTimeItemRef && eventTimeItemRef.update({});
    return (
      eventTimeItemRef &&
      eventTimeItemRef.update({
        people: firebase.firestore.FieldValue[
          checked ? "arrayUnion" : "arrayRemove"
        ](personId)
      })
    );
  };

  doUpdateEventTimeItem = async (
    eventId: string,
    timeItemId: string,
    timeItemInfo: any
  ) => {
    const eventsRef = await this.getEventsRef();
    const timeItemRef =
      eventsRef &&
      eventsRef
        .doc(eventId)
        .collection("timeItems")
        .doc(timeItemId);
    return timeItemRef && timeItemRef.update(timeItemInfo);
  };

  // TOURS //
  private expandTourDates = async (tourId: string, date: string) => {
    const tourRef = await this.getTourRef(tourId);
    if (tourRef) {
      const tour = tourRef.get().then(doc => doc.data());
      if (tour) {
        console.log("tour", tour);
      }
    }
  };
  doUpdateTour = async (
    tourId: string,
    updateObj: { name?: string; startDate?: string; endDate?: string }
  ) => {
    const tourRef = await this.getTourRef(tourId);
    if (tourRef) {
      tourRef.update(updateObj);
    }
  };
  doCreateTour = async (name: string, startDate: Moment, endDate: Moment) => {
    if (!this.auth.currentUser) {
      console.log("NO USER!");
      return null;
    }
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    const uid = this.auth.currentUser.uid;
    const toursRef = this.firestore.collection(
      `accounts/${myProfile.currentAccount}/tours`
    );
    const response = await toursRef.add({
      name,
      createdBy: uid,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    console.log("response", response);
    return response;
  };

  getTourRef = async (tourId: string) => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    const tourRef = this.firestore.doc(
      `accounts/${myProfile.currentAccount}/tours/${tourId}`
    );
    return tourRef;
  };

  doAdjustSubTours = async (
    tourId: string,
    index: number,
    startDate: string
  ) => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    const tourRef = this.firestore.doc(
      `accounts/${myProfile.currentAccount}/tours/${tourId}`
    );
    const tour = await tourRef.get().then(doc => doc.data());
    const subTours = (tour && tour.subTours) || { startTimes: [] };
    subTours.startTimes[index] = startDate;
    const prevDate =
      !!subTours.startTimes[index - 1] && subTours.startTimes[index - 1];
    const nextDate =
      !!subTours.startTimes[index + 1] && subTours.startTimes[index + 1];
    subTours.startTimes.sort();

    return tourRef.update({ subTours });
  };
  doUpdateSubTourEvents = async (
    events: string[],
    subTourId: string,
    tourId: string
  ) => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    const subTourRef = this.firestore.doc(
      `accounts/${myProfile.currentAccount}/tours/${tourId}/subTours/${subTourId}`
    );
    subTourRef.update({ events });
  };
  // PEOPLE //
  private addAirportsToPerson = async (person: Person) => {
    if (!!person.homeAddress) {
      //@ts-ignore
      person.homeAddress = removeMissing(person.homeAddress);
      //@ts-ignore
      const { lat, lng } = person.homeAddress;
      if (!person.airports) {
        const { getAirportsNearPoint, mapAPResultToAP } = amadeusFxns();
        if (lat && lng) {
          const airports = await getAirportsNearPoint(lat, lng);
          if (airports) {
            person.airports = airports
              .slice(0, 3)
              .map(mapAPResultToAP)
              .sort((a, b) => (a.distance.value < b.distance.value ? -1 : 1));
            person.airports[0].preferred = true;
          }
        }
      }
    }
    return person;
  };
  doResetAirports = async (person: Person) => {
    const { homeAddress, id } = person;
    //@ts-ignore
    this.doUpdatePerson({ homeAddress, id });
  };
  doCreatePerson = async (person: Person) => {
    // then this will need to connect to an actual persons account.
    // can i create a person without signing them in automatically?
    // create a special login page - you would send a group member there
    // then they sign up,  and doing so puts your company
    // in their profile.  (groups I'm a part of)
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    const peopleRef = this.firestore.collection(
      `accounts/${myProfile.currentAccount}/people`
    );
    const personWithAirports = await this.addAirportsToPerson(person);
    const newPerson = await peopleRef.add(removeMissing(personWithAirports));
    return newPerson;
  };
  doUpdatePerson = async (person: Person) => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    if (!person.id) throw new Error("no person id received");
    const personRef = this.firestore.doc(
      `accounts/${myProfile.currentAccount}/people/${person.id}`
    );
    const personWithAirports = await this.addAirportsToPerson(person);
    const response = await personRef.update(removeMissing(personWithAirports));
    console.log("response", response);
  };
  doCreateGroup = async (name: string) => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    if (!name) throw new Error("name required");
    const groupsRef = this.firestore.collection(
      `accounts/${myProfile.currentAccount}/groups`
    );
    const response = await groupsRef.add({ name, members: [] });
    console.log("create group response", response);
  };
  doUpdateGroup = async ({
    groupId,
    updateObj
  }: {
    groupId: string;
    updateObj: {
      name?: string;
      members?: string[];
      colorIndex?: number;
    };
  }) => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    const groupRef = this.firestore.doc(
      `accounts/${myProfile.currentAccount}/groups/${groupId}`
    );
    const response = await groupRef.update(updateObj);
  };
  doDeleteGroup = async (groupId: string) => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    const groupRef = this.firestore.doc(
      `accounts/${myProfile.currentAccount}/groups/${groupId}`
    );
    const response = await groupRef.delete();

    console.log("response", response);
  };
  private getGroupRef = async (groupId: string) => {
    const myProfile = await this.getUserProfile();
    if (!myProfile) return null;
    return this.firestore.doc(
      `accounts/${myProfile.currentAccount}/groups/${groupId}`
    );
  };
  doChangePersonInGroup = async (
    personId: string,
    groupId: string,
    add?: boolean
  ) => {
    const groupRef = await this.getGroupRef(groupId);
    return (
      groupRef &&
      groupRef.update({
        members: firebase.firestore.FieldValue[
          add ? "arrayUnion" : "arrayRemove"
        ](personId)
      })
    );
  };
  doChangePersonInTour = async (
    personId: string,
    tourId: string,
    add?: boolean
  ) => {
    const tourRef = await this.getTourRef(tourId);
    return (
      tourRef &&
      tourRef.update({
        tourMembers: firebase.firestore.FieldValue[
          add ? "arrayUnion" : "arrayRemove"
        ](personId)
      })
    );
  };
  doAddPeopleToTour = async (personIds: string[], tourId: string) => {
    const tourRef = await this.getTourRef(tourId);
    if (!tourRef) return null;
    const tourInfo = await tourRef.get().then(doc => doc.data());
    const tourMembers = (tourInfo && tourInfo.tourMembers) || [];
    const newTourMembers = Array.from(new Set([...tourMembers, ...personIds]));
    tourRef.update({ tourMembers: newTourMembers });
  };
}

export default Firebase;
