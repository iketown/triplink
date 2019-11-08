import React, { useState, useEffect, useMemo } from 'react'
import useAuth from '../Account/UserCtx'
import { useFirebaseCtx } from '../Firebase'
import moment from 'moment'
import { LocBasicType } from './EventDialog'
//
//

export type TourEvent = {
  id?: string
  startDate: string
  startTime?: string
  endDate?: string
  tourId: string
  locBasic: LocBasicType
}

export const useEvents = (tourId: string) => {
  const [events, setEvents] = useState<TourEvent[]>([])
  const { userProfile } = useAuth()
  const { firestore } = useFirebaseCtx()

  useEffect(() => {
    if (userProfile) {
      const eventsRef = firestore
        .collection(`/accounts/${userProfile.currentAccount}/events`)
        .where('tourId', '==', tourId)
      const unsubscribe = eventsRef.onSnapshot(snapshot => {
        console.log('updating EVENTS')
        const _events: any = []
        snapshot.forEach(doc => {
          _events.push({ ...doc.data(), id: doc.id })
        })
        setEvents(_events)
      })
      return unsubscribe
    }
  }, [firestore, tourId, userProfile])

  const eventsObj = useMemo(() => {
    console.log('memoizing eventsObj')
    const _eventsObj = events
      .sort((a: TourEvent, b: TourEvent) => {
        if (a.startDate < b.startDate) return -1
        return 1
      })
      .reduce(
        (
          obj: { [key: string]: TourEvent[] },
          event: TourEvent,
          index: number
        ) => {
          const date = moment(event.startDate).format('MM/DD')
          if (!!obj[date]) obj[date].push(event)
          else obj[date] = [event]
          return obj
        },
        {}
      )
    return _eventsObj
  }, [events])

  return { events, eventsObj }
}
