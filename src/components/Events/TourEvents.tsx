import React, { useEffect, useState, useMemo, Fragment } from 'react'
import {
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Collapse,
  Typography,
  Button,
  Divider
} from '@material-ui/core'
import { StarBorder, Add, ArrowDropDown } from '@material-ui/icons'
import { useFirebaseCtx } from '../Firebase'
import useAuth from '../Account/UserCtx'
import { Tour } from '../Tours/Tours'
import ShowMe from '../../utils/ShowMe'
import moment, { Moment } from 'moment'
import { getArrayOfDates } from '../../utils/dateFxns'
import { useEvents, TourEvent } from './useEvents'
import { useDialogCtx } from '../Dialogs/DialogCtx'

export const TourEvents = ({ tour }: { tour: Tour }) => {
  const { firestore } = useFirebaseCtx()
  const { user } = useAuth()
  const { events, eventsObj } = useEvents(tour.id)
  const { dispatch } = useDialogCtx()
  const handleCreateEvent = () => {
    dispatch({
      type: 'CREATE_EVENT',
      initialValues: { startDate: tour.startDate, tourId: tour.id }
    })
  }
  if (!events.length)
    return (
      <CardContent style={{ textAlign: 'center' }}>
        <Typography gutterBottom>No Events</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateEvent}>
          Create Event
        </Button>
      </CardContent>
    )
  return (
    <CardContent>
      TOUR EVENTS
      <List dense>
        {Object.entries(eventsObj).map(([date, eventArr], index) => {
          const isFirst = index === 0
          const isLast = index === Object.keys(eventsObj).length - 1
          const nextDate = Object.values(eventsObj)[index + 1]
          const nextDateTime = nextDate ? nextDate[0].startDate : null
          const isGigNextDay =
            nextDateTime &&
            moment(eventArr[0].startDate)
              .endOf('day')
              .add(1, 'day')
              .isSameOrAfter(nextDateTime)
          return (
            <Fragment key={date}>
              {isFirst && (
                <TourEventSpacerListItem
                  tourId={tour.id}
                  key={date + 'before'}
                  date={moment(eventArr[0].startDate).subtract(1, 'day')}
                />
              )}
              {
                //@ts-ignore
                <TourEventListItem date={date} eventArr={eventArr} />
              }
              {!isLast && !isGigNextDay && nextDateTime && (
                <TourEventSpacerDates
                  tourId={tour.id}
                  key={date + 'inBetween'}
                  mustBeAfter={eventArr[0].startDate}
                  mustBeBefore={nextDateTime}
                />
              )}
              {isLast && (
                <TourEventSpacerListItem
                  tourId={tour.id}
                  key={date + 'after'}
                  date={moment(eventArr[0].startDate).add(1, 'day')}
                />
              )}
            </Fragment>
          )
        })}
      </List>
    </CardContent>
  )
}

function TourEventListItem({
  date,
  eventArr
}: {
  date: string
  eventArr: TourEvent[]
}) {
  return eventArr.map((event, index) => {
    return (
      <TourEventSingleListItem
        key={event.id}
        event={event}
        date={date}
        dividerBottom={index + 1 === eventArr.length}
      />
    )
  })
}

const TourEventSingleListItem = ({
  event,
  date,
  dividerBottom = true
}: {
  event: TourEvent
  date: string
  dividerBottom?: boolean
}) => {
  const { dispatch } = useDialogCtx()
  const handleEditEvent = () => {
    const { locBasic, ...eventInfo } = event
    const { venueName, locShortName } = locBasic
    const initialValues = {
      ...eventInfo,
      location: locBasic,
      venueName,
      locShortName
    }
    dispatch({ type: 'EDIT_EVENT', initialValues })
  }
  return (
    <>
      <ListItem button onClick={handleEditEvent}>
        <Fragment key={event.id}>
          <ListItemAvatar>
            <StarBorder />
          </ListItemAvatar>
          <ListItemText
            primary={`${date} • ${event.locBasic &&
              event.locBasic.locShortName}`}
          />
        </Fragment>
      </ListItem>
      {dividerBottom && <Divider />}
    </>
  )
}

const TourEventSpacerListItem = ({
  date,
  tourId
}: {
  date: Moment
  tourId: string
}) => {
  const { dispatch } = useDialogCtx()
  const handleCreateEvent = () => {
    dispatch({
      type: 'CREATE_EVENT',
      initialValues: { startDate: date, tourId }
    })
  }
  return (
    <ListItem divider dense button onClick={handleCreateEvent}>
      <ListItemAvatar>
        <Add />
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{ color: 'textSecondary' }}
        primary={`${date.format('ddd MM/DD')}`}
      />
    </ListItem>
  )
}

const TourEventSpacerDates = ({
  mustBeBefore,
  mustBeAfter,
  tourId
}: {
  mustBeAfter: string
  mustBeBefore: string
  tourId: string
}) => {
  const [expanded, setExpanded] = useState(false)
  const arrayOfDates = useMemo(() => {
    return getArrayOfDates({
      first: mustBeAfter,
      last: mustBeBefore
    })
  }, [mustBeAfter, mustBeBefore])
  if (arrayOfDates.length === 1) {
    return (
      <TourEventSpacerListItem
        tourId={tourId}
        date={moment(mustBeAfter).add(1, 'day')}
      />
    )
  }
  return (
    <>
      <ListItem
        selected={expanded}
        divider
        dense
        button
        onClick={() => setExpanded(old => !old)}
      >
        <ListItemAvatar>
          <ArrowDropDown
            style={{
              transform: `rotate(${expanded ? 0 : -180}deg)`,
              transition: 'transform .5s'
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ color: 'textSecondary' }}
          primary={'add new'}
        />
      </ListItem>
      <Collapse in={expanded}>
        {arrayOfDates.map((date, index) => {
          return (
            <TourEventSpacerListItem
              key={date.toISOString()}
              tourId={tourId}
              date={date}
            />
          )
        })}
      </Collapse>
    </>
  )
}

export default TourEvents
