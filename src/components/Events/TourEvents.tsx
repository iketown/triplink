import React, { useEffect, useState, useMemo, Fragment } from 'react'
import {
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Collapse
} from '@material-ui/core'
import { StarBorder, Add, ArrowDropDown } from '@material-ui/icons'
import { useFirebaseCtx } from '../Firebase'
import useAuth from '../Account/UserCtx'
import { Tour } from '../Tours/Tours'
import ShowMe from '../../utils/ShowMe'
import moment, { Moment } from 'moment'
import { getArrayOfDates } from '../../utils/dateFxns'
type TourEvent = {
  id: string
  startDateTime: string
  endDateTime: string
  city: string
  state: string
  country: string
}

export const TourEvents = ({ tour }: { tour: Tour }) => {
  const { firestore } = useFirebaseCtx()
  const [events, setEvents] = useState<TourEvent[]>([])
  const user = useAuth()
  const eventsObj = useMemo(() => {
    const _eventsObj = events
      .sort((a: TourEvent, b: TourEvent) => {
        if (a.startDateTime < b.startDateTime) return -1
        return 1
      })
      .reduce(
        (
          obj: { [key: string]: TourEvent[] },
          event: TourEvent,
          index: number
        ) => {
          const date = moment(event.startDateTime).format('MM/DD')
          if (!!obj[date]) obj[date].push(event)
          else obj[date] = [event]
          return obj
        },
        {}
      )
    return _eventsObj
  }, [events])
  useEffect(() => {
    if (user) {
      const eventsRef = firestore.collection(`tours/${tour.id}/events`)
      const unsubscribe = eventsRef.onSnapshot(querySnapshot => {
        const _events: TourEvent[] = []
        querySnapshot.forEach(doc => {
          // @ts-ignore
          _events.push({ ...doc.data(), id: doc.id })
        })
        setEvents(_events)
      })
      return unsubscribe
    }
  }, [firestore, tour.id, user])
  return (
    <CardContent>
      TOUR EVENTS
      <List dense>
        {Object.entries(eventsObj).map(([date, eventArr], index, array) => {
          const isFirst = index === 0
          const isLast = index === Object.keys(eventsObj).length - 1
          const nextDate = Object.values(eventsObj)[index + 1]
          const nextDateTime = nextDate ? nextDate[0].startDateTime : null
          const isGigNextDay =
            nextDateTime &&
            moment(eventArr[0].startDateTime)
              .endOf('day')
              .add(1, 'day')
              .isSameOrAfter(nextDateTime)
          return (
            <Fragment key={date}>
              {isFirst && <TourEventSpacerListItem key={date + 'before'} />}

              <TourEventListItem key={date} date={date} eventArr={eventArr} />

              {!isLast && !isGigNextDay && nextDateTime && (
                <TourEventSpacerDates
                  key={date + 'inBetween'}
                  mustBeAfter={eventArr[0].startDateTime}
                  mustBeBefore={nextDateTime}
                />
              )}
              {isLast && <TourEventSpacerListItem key={date + 'after'} />}
            </Fragment>
          )
        })}
      </List>
    </CardContent>
  )
}

export default TourEvents

const TourEventListItem = ({
  date,
  eventArr
}: {
  date: string
  eventArr: TourEvent[]
}) => {
  return (
    <ListItem divider>
      <ListItemAvatar>
        <StarBorder />
      </ListItemAvatar>
      <ListItemText
        primary={`${date} • ${eventArr[0].city} ${eventArr[0].state}`}
      />
    </ListItem>
  )
}

const TourEventSpacerListItem = () => {
  return (
    <ListItem divider dense button onClick={() => console.log('adding')}>
      <ListItemAvatar>
        <Add />
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{ color: 'textSecondary' }}
        primary={'add new event'}
      />
    </ListItem>
  )
}

const TourEventSpacerDates = ({
  mustBeBefore,
  mustBeAfter
}: {
  mustBeAfter: string
  mustBeBefore: string
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
      <ListItem divider dense button>
        <ListItemAvatar>
          <Add color="disabled" />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ color: 'textSecondary' }}
          primary={`${arrayOfDates[0].format('ddd MMM DD')} - create event`}
        />
      </ListItem>
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
        {arrayOfDates.map(date => {
          return (
            <ListItem divider dense button>
              <ListItemAvatar>
                <Add color="disabled" />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ color: 'textSecondary' }}
                primary={`${date.format('ddd MMM DD')} - create event`}
              />
            </ListItem>
          )
        })}
      </Collapse>
    </>
  )
}
