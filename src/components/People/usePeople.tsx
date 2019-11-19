import React, { useState, useEffect, useMemo } from "react";
import { Person, Group } from "./people.types";
import { useFirebaseCtx } from "../Firebase/firebase.context";
import useAuth from "../Account/UserCtx";

export const usePeople = (tourId?: string) => {
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [tourPeople, setTourPeople] = useState<Person[]>([]);
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
      });
      return unsubscribe;
    }
  }, [tourId, userProfile]);

  return { allPeople };
};

export const useGroup = (groupId?: string) => {
  const { groups } = useGroups();
  const group = useMemo(() => {
    return groups && groups.find(grp => grp.id === groupId);
  }, [groups]);
  return { group };
};

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>();
  const { userProfile } = useAuth();
  const { firestore } = useFirebaseCtx();

  useEffect(() => {
    if (!userProfile) return;
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
  }, [userProfile, firestore]);

  return { groups };
};
