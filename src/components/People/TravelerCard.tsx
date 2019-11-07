import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button
} from '@material-ui/core'

//
//

type Person = {
  firstName: string
  lastName: string
  displayName: string
  uid: string
  imageURL: string
}

export const TravelerCard = ({ person }: { person: Person }) => {
  const { firstName, lastName, displayName, uid } = person
  return (
    <Card>
      <CardHeader title={displayName} subheader={`${firstName} ${lastName}`} />
      <CardContent></CardContent>
      <CardActions>
        <Button>Edit</Button>
      </CardActions>
    </Card>
  )
}

export default TravelerCard
