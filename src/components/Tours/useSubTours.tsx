import React, { useState, useEffect, useMemo } from 'react'
import { useFirebaseCtx } from '../Firebase/firebase.context'
import useAuth from '../Account/UserCtx'
import { useEvents, } from '../Events/useEvents'
import { TourEvent } from '../Events/event.types'
import { number } from 'prop-types'
import { useTours } from './useTours'

//
//

export const useSubTours = (tourId: string) => {
  const { tours } = useTours()
  const tour = tours.find(t => t.id === tourId)
  if (!tour) return { subTours: null }
  const { subTours } = tour
  return { subTours }
}

// const subToursObj: SubToursObj = useMemo(() => {
//   const _subToursObj = events.reduce<any>((obj, event) => {
//     if (!obj[event.subTourIndex])
//       obj[event.subTourIndex] = { events: [event] }
//     else obj[event.subTourIndex].events.push(event)
//     return obj
//   }, {})
//   for (let index in _subToursObj) {
//     _subToursObj[index].events.sort((a: TourEvent, b: TourEvent) => {
//       if (!a || !b) return 0
//       return a.startTime < b.startTime ? -1 : 1
//     })
//     _subToursObj[index].first = _subToursObj[index].events[0].startTime
//     _subToursObj[index].last =
//       _subToursObj[index].events[
//         _subToursObj[index].events.length - 1
//       ].startTime
//   }
//   console.log('new subToursObj', _subToursObj)
//   return _subToursObj
