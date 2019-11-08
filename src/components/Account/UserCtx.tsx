import React, { useEffect, useState } from 'react'
import { useFirebaseCtx } from '../Firebase'
import { User } from 'firebase'

type UserProfileType = {
  firstName: string
  lastName: string
  currentAccount?: string
}

const useAuth = ():{user: User, userProfile?: UserProfileType} => {
  const { auth , firestore} = useFirebaseCtx()
  const [user, setUser] = useState()
  const [userProfile, setUserProfile] = useState<UserProfileType>()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(_user => {
      if (_user) {
        setUser(_user)
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [auth])

  useEffect(()=>{
    let unsubscribe;
    if(user){
      unsubscribe = firestore.doc(`/userProfiles/${user.uid}`).onSnapshot(doc => {
        if(doc.exists && doc.data()){
          // @ts-ignore
          const {firstName, lastName, currentAccount} = doc.data() 
          setUserProfile({firstName, lastName, currentAccount})
        }
      })
    }
  },[user])
  return {user, userProfile}
}

export default useAuth
