import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Person, Group } from "./people.types";
import { useFirebaseCtx } from "../Firebase/firebase.context";
import useAuth from "../Account/UserCtx";
import { useTours, useTour } from "../Tours/useTours";

export const usePeople = (tourId?: string) => {
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [allPeopleObj, setAllPeopleObj] = useState<{ [id: string]: Person }>();
  const [tourPeople, setTourPeople] = useState<Person[]>([]);
  const { tours } = useTours();
  const { userProfile } = useAuth();
  const { firestore, getUserProfile } = useFirebaseCtx();

  useEffect(() => {
    if (userProfile) {
      const peopleRef = firestore.collection(
        `accounts/${userProfile.currentAccount}/people`
      );
      const unsubscribe = peopleRef.onSnapshot(snapshot => {
        // if (snapshot.empty) return null;
        const _allPeople: Person[] = [];
        snapshot.forEach(doc => {
          //@ts-ignore
          _allPeople.push({ ...doc.data(), id: doc.id });
        });
        setAllPeople(
          _allPeople.sort((a, b) => (a.lastName < b.lastName ? -1 : 1))
        );
        setAllPeopleObj(
          _allPeople.reduce((obj: { [id: string]: Person }, person: Person) => {
            obj[person.id] = person;
            return obj;
          }, {})
        );
      });
      return unsubscribe;
    }
  }, [tourId, userProfile]);

  useEffect(() => {
    if (tourId && tours && allPeople.length) {
      const tour = tours.find(t => t.id === tourId);
      const tourMemberIds = (tour && tour.tourMembers) || [];
      const _tourPeople = allPeople
        .filter(person => tourMemberIds.includes(person.id))
        .sort((a, b) => (a.lastName < b.lastName ? -1 : 1));
      setTourPeople(_tourPeople);
    }
  }, [tourId, tours, allPeople]);

  return { allPeople, tourPeople, allPeopleObj };
};

export const useGroup = (groupId?: string) => {
  const { groups } = useGroups();
  const group = useMemo(() => {
    return groups && groups.find(grp => grp.id === groupId);
  }, [groups]);

  return { group };
};

export const useGroupSubset = (tourId: string) => {
  const { tourPeople, allPeopleObj } = usePeople(tourId);
  const { tour } = useTour(tourId);
  const { groups } = useGroups();

  const getShortSubsetText = (subsetPeopleIds: string[]) => {
    if (!subsetPeopleIds.length) return "no people";
    let returnString = "";

    type GroupPeopleEntry = {
      [groupId: string]: { inSS: string[]; outSS: string[]; group: Group };
    };
    const onThisTourFilter = (id: string) =>
      tour && tour.tourMembers.includes(id);
    const groupPeopleObj = groups.reduce<GroupPeopleEntry>((obj, group) => {
      if (!group.id) return obj;
      const inSS = // in SubSet
        (group.members &&
          group.members
            .filter(onThisTourFilter)
            .filter(id => subsetPeopleIds.includes(id))) ||
        [];
      const outSS = // not in SubSet
        (group.members &&
          group.members
            .filter(onThisTourFilter)
            .filter(id => !subsetPeopleIds.includes(id))) ||
        [];
      obj[group.id] = { inSS, outSS, group };
      return obj;
    }, {});
    Object.entries(groupPeopleObj)
      .sort((a, b) => {
        return a[1].outSS.length - b[1].outSS.length;
      })
      .forEach(([groupId, { inSS, outSS, group }]) => {
        if (!outSS.length && !inSS.length) {
          // noone in this group at all
          console.log("empty group?", group.name);
          return;
        }
        if (!inSS.length) return;
        if (!outSS.length) {
          // this whole group is IN
          returnString += `${group.name.toUpperCase()} `;
          return;
        }
        if (inSS.length <= outSS.length) {
          // individuals who are IN
          returnString += inSS
            .map(id => {
              const person = allPeopleObj && allPeopleObj[id];
              return person ? `${person.displayName} ` : "";
            })
            .join("");
          return;
        }
        returnString += `(${group.name.toUpperCase()} no `;
        returnString += outSS
          .map(id => {
            const person = allPeopleObj && allPeopleObj[id];
            console.log(
              "single missing person",
              person && person.displayName,
              inSS,
              outSS
            );
            return person ? `${person.displayName} ` : "";
          })
          .join("");
        returnString += ") ";
      });

    return returnString;
  };

  return { getShortSubsetText };
};

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const { userProfile } = useAuth();
  const { firestore } = useFirebaseCtx();

  useEffect(() => {
    if (userProfile) {
      const groupsRef = firestore.collection(
        `accounts/${userProfile.currentAccount}/groups`
      );
      const unsubscribe = groupsRef.onSnapshot(snapshot => {
        if (snapshot.empty) return;
        const _groups: Group[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          //@ts-ignore
          _groups.push({ ...doc.data(), id: doc.id });
        });
        setGroups(_groups.sort((a, b) => (a.name < b.name ? -1 : 1)));
      });
      return unsubscribe;
    }
  }, [userProfile, firestore]);

  return { groups };
};
