import React, { useState, useEffect } from 'react'
import { useFirebaseCtx } from '../Firebase'
import useAuth from '../Account/UserCtx'
import { Tour } from './types'

export const useTours = () => {
  const [tours, setTours] = useState<Tour[]>([])
  const { firestore } = useFirebaseCtx()
  const { userProfile } = useAuth()
  useEffect(() => {
    if (userProfile) {
      console.log('useEffect useTours')
      const toursRef = firestore.collection(
        `accounts/${userProfile.currentAccount}/tours`
      )
      const unsubscribe = toursRef.onSnapshot(querySnapshot => {
        const _myTours: Tour[] = []
        querySnapshot.forEach(doc => {
          // @ts-ignore
          _myTours.push({ ...doc.data(), id: doc.id })
        })
        setTours(
          _myTours.sort((a, b) => {
            if (a.startDate < b.startDate) return -1
            return 1
          })
        )
      })
      return unsubscribe
    }
  }, [userProfile, firestore])
  return { tours }
}
