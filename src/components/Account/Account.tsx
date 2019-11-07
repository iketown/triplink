import React, { useState } from 'react'
import { useFirebaseCtx } from '../Firebase'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Button
} from '@material-ui/core'
//
import TravelerCard from '../People/TravelerCard'
import faker from 'faker'
//
//
const firstName = faker.name.firstName()
const lastName = faker.name.lastName()
const imageURL = faker.image.avatar()
const fakePerson = {
  firstName,
  lastName,
  imageURL,
  displayName: `${firstName} ${lastName}`,
  uid: '12345'
}
const Account = () => {
  const [editing, setEditing] = useState(false)
  const { auth } = useFirebaseCtx()
  console.log('current', auth.currentUser)
  return <TravelerCard person={fakePerson} />
}

export default Account
