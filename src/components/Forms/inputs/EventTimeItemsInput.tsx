import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Collapse,
  ListItemText,
  Typography,
  IconButton,
  Tooltip
} from "@material-ui/core";
import { colors } from "../../../utils/colors";
import { TourEvent, TimeItem } from "../../Events/event.types";
import { useEventTimeItems, useEventFxns } from "../../Events/useEvents";
import ShowMe from "../../../utils/ShowMe";
import { FaClock } from "react-icons/fa";
import RotatingArrowButton from "../../Cards/RotatingArrowButton";
import { Person } from "../../People/people.types";
//@ts-ignore
import { Image, Transformation } from "cloudinary-react";
import { usePeople } from "../../People/usePeople";

//
//
const EventTimeItemsInput = ({ event }: { event: TourEvent | any }) => {
  const { timeItems } = useEventTimeItems(event.id);
  return (
    <>
      <List>
        {timeItems.map(timeItem => {
          return <TimeItemListItem timeItem={timeItem} />;
        })}
      </List>
      <ShowMe obj={timeItems} name="timeItems" noModal />
      <ShowMe obj={event} name="event" noModal />
    </>
  );
};

export default EventTimeItemsInput;

const TimeItemListItem = ({ timeItem }: { timeItem: TimeItem }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Typography variant="caption">3:30</Typography>
        </ListItemAvatar>
        <ListItemText primary={timeItem.title} />
        <ListItemSecondaryAction>
          <RotatingArrowButton
            direction="ccw"
            expanded={expanded}
            onClick={() => setExpanded(old => !old)}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={expanded}>
        <ListItem>
          {timeItem.people && <AvatarGroup peopleIds={timeItem.people} />}
        </ListItem>
      </Collapse>
    </>
  );
};

const AvatarGroup = ({ peopleIds }: { peopleIds: string[] }) => {
  const { allPeople } = usePeople();

  return (
    <div>
      {peopleIds.map(personId => {
        const person = allPeople.find(p => p.id === personId);
        if (!person) return null;
        return <CircleAvatarToggle person={person} />;
      })}
    </div>
  );
};

const CircleAvatarToggle = ({
  person,
  onClick
}: {
  person: Person;
  onClick?: () => void;
}) => {
  return (
    <Tooltip title={person.displayName}>
      <IconButton size="small" style={{ background: "beige" }}>
        <Image publicId={person.avatarPublicId}>
          <Transformation
            width={30}
            height={30}
            fetchFormat="auto"
            crop="thumb"
            gravity="face"
            radius="max"
          />
        </Image>
      </IconButton>
    </Tooltip>
  );
};
