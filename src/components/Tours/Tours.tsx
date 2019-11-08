import React, { useState, useEffect } from 'react'
import TourForm from './TourForm'
import TourCard, { NewTourCard } from './TourCard'
import { Typography } from '@material-ui/core'
import { useFirebaseCtx } from '../Firebase'
import ShowMe from '../../utils/ShowMe'
import useAuth from '../Account/UserCtx'
import moment from 'moment'
import { useTours } from './useTours'
export type Tour = {
  createdBy: string
  name: string
  startDate: string
  endDate: string
  id: string
}

const Tours = () => {
  const { tours } = useTours()
  return (
    <div>
      <Typography variant="h3">TOURS</Typography>
      {tours.map((tour: Tour) => {
        return <TourCard key={tour.id} {...{ tour }} />
      })}
      <NewTourCard />
      <ShowMe obj={tours} noModal name="tours" />
    </div>
  )
}

export default Tours
