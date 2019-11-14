import React, { Fragment, useState } from 'react'
import { Tour } from '../Tours/types'
import { useEvents } from '../Events/useEvents'
import {
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Collapse,
  IconButton,
  Tooltip
} from '@material-ui/core'
import ShowMe from '../../utils/ShowMe'
import moment from 'moment-timezone'
import { StarOutlined, StarBorder } from '@material-ui/icons'
import { TravelTypes } from './travel.types'
import { LocationType, LocBasicType } from '../Locations/location.types'
import RotatingArrowButton from '../Cards/RotatingArrowButton'
import { FaPlane, FaBusAlt, FaTaxi, FaTrain, FaBus } from 'react-icons/fa'
import { useDialogCtx } from '../Dialogs/DialogCtx'
export const TourTravels = ({ tour }: { tour: Tour }) => {
  const { events } = useEvents(tour.id)
  return (
    <CardContent>
      TOUR TRAVELS
      <List dense>
        {events.map((event, index) => {
          const nextEvent = events[index + 1]
          const isSamePlace =
            nextEvent && nextEvent.locBasic.placeId === event.locBasic.placeId
          return (
            <Fragment key={event.id || index}>
              <ListItem
                dense
                style={{
                  background: '#f3f3f3',
                  marginTop: 0,
                  marginBottom: 0,
                  borderRadius: '10px'
                }}
              >
                <ListItemAvatar>
                  <StarBorder />
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{ variant: 'caption' }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    style: { marginLeft: '1rem' }
                  }}
                  primary={`${moment(event.startTime).format('MM/DD')} • ${
                    event.locBasic.locShortName
                  }`}
                  secondary={event.locBasic.venueName}
                />
              </ListItem>
              {nextEvent && !isSamePlace && (
                <TravelButtonListItem
                  from={event.locBasic}
                  to={nextEvent.locBasic}
                  startTime={event.startTime}
                />
              )}
            </Fragment>
          )
        })}
      </List>
      <ShowMe obj={events} name="events" noModal />
    </CardContent>
  )
}

export const TravelButtonListItem = ({
  from,
  to,
  startTime
}: {
  from?: LocBasicType
  to?: LocBasicType
  startTime: string
}) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <ListItem button onClick={() => setExpanded(old => !old)}>
        <ListItemAvatar>
          <RotatingArrowButton expanded={expanded} direction="cw" />
        </ListItemAvatar>
        <ListItemText
          primary={'Travel'}
          secondary={`${from && from.locShortName.split(',')[0]} → ${to &&
            to.locShortName.split(',')[0]}`}
        />
        <TravelButtons from={from} to={to} startTime={startTime} />
      </ListItem>
      <Collapse in={expanded}>hey now</Collapse>
    </>
  )
}

interface ITravelButtons {
  from?: LocBasicType
  to?: LocBasicType
  startTime: string
}
export const TravelButtons = ({ from, to, startTime }: ITravelButtons) => {
  const { dispatch } = useDialogCtx()
  const handleClick = (e: React.MouseEvent, travelType: string) => {
    e.stopPropagation()
    dispatch({
      type: 'CREATE_TRAVEL',
      initialValues: { from, to, startTime, travelType }
    })
  }
  return (
    <ListItemAvatar>
      {[
        { Icon: FaPlane, title: TravelTypes.air },
        { Icon: FaBus, title: TravelTypes.tourBus },
        { Icon: FaBusAlt, title: TravelTypes.shuttleBus },
        { Icon: FaTrain, title: TravelTypes.train },
        { Icon: FaTaxi, title: TravelTypes.taxi }
      ].map(({ Icon, title }, index) => {
        return (
          <Tooltip placement="top" title={`Travel by ${title}`}>
            <IconButton onClick={e => handleClick(e, title)} key={index}>
              <Icon size={17} />
            </IconButton>
          </Tooltip>
        )
      })}
    </ListItemAvatar>
  )
}
