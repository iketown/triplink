import React, { useState, useEffect } from 'react'
import TourForm from './TourForm'
import TourCard, { NewTourCard } from './TourCard'
import { Typography } from '@material-ui/core'
import { useFirebaseCtx } from '../Firebase'
import ShowMe from '../../utils/ShowMe'
import useAuth from '../Account/UserCtx'
import moment from 'moment'

export type Tour = {
  admin: string
  name: string
  startDate: string
  endDate: string
  id: string
}

const Tours = () => {
  const [myTours, setMyTours] = useState<Tour[]>([])
  const { firestore, auth } = useFirebaseCtx()
  const user = useAuth()
  useEffect(() => {
    if (auth.currentUser) {
      const toursRef = firestore
        .collection('tours')
        .where('admin', '==', auth.currentUser.uid)
      const unsubscribe = toursRef.onSnapshot(querySnapshot => {
        const _myTours: Tour[] = []
        querySnapshot.forEach(doc => {
          // @ts-ignore
          _myTours.push({ ...doc.data(), id: doc.id })
        })
        setMyTours(_myTours)
        console.log('_myTours', _myTours)
      })
      return unsubscribe
    }
  }, [auth.currentUser, firestore])
  return (
    <div>
      <Typography variant="h3">TOURS</Typography>
      {myTours.map((tour: Tour) => {
        return <TourCard key={tour.id} {...{ tour }} />
      })}
      <NewTourCard />
      <ShowMe obj={myTours} noModal name="myTours" />
    </div>
  )
}

export default Tours
