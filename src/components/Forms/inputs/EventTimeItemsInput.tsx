import React, { useState, useMemo } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Collapse,
  ListItemText,
  Typography,
  Button
} from "@material-ui/core";
import { colors } from "../../../utils/colors";
import { TourEvent, TimeItem } from "../../Events/event.types";
import { useEventTimeItems, useEventFxns } from "../../Events/useEvents";
import ShowMe from "../../../utils/ShowMe";
import RotatingArrowButton from "../../Cards/RotatingArrowButton";
import { Person, Group } from "../../People/people.types";
//@ts-ignore
import { Image, Transformation } from "cloudinary-react";
import { usePeople, useGroups } from "../../People/usePeople";
import { useFirebaseCtx } from "../../Firebase";
import { useEventCtx } from "../../Events/EventCtx";
import CircleAvatarToggle from "./CircleAvatarToggle";
//
//
const EventTimeItemsInput = () => {
  const { timeItems } = useEventCtx();
  return (
    <>
      <List>
        {timeItems &&
          timeItems.map((timeItem: TimeItem) => {
            return <TimeItemListItem timeItem={timeItem} />;
          })}
      </List>
      <ShowMe obj={timeItems} name="timeItems" noModal />
    </>
  );
};

export default EventTimeItemsInput;

const TimeItemListItem = ({ timeItem }: { timeItem: TimeItem }) => {
  const [expanded, setExpanded] = useState(false);
  const { event } = useEventCtx();
  const { changeTimeItemPeople } = useEventTimeItems(event && event.id);

  const { allIn, someIn } = useMemo((): {
    allIn?: boolean;
    someIn?: boolean;
  } => {
    const personInTimeItem = (mem: string) =>
      timeItem.people && timeItem.people.includes(mem);
    const allIn = event.memberIds && event.memberIds.every(personInTimeItem);
    const someIn = event.memberIds && event.memberIds.some(personInTimeItem);
    return { allIn, someIn };
  }, [event.memberIds, timeItem.people]);

  const handleGroupAddRemove = () => {
    if (!timeItem.id) return null;
    changeTimeItemPeople(timeItem.id, event.memberIds, !allIn);
  };
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Typography variant="caption">3:30</Typography>
        </ListItemAvatar>
        <ListItemText primary={timeItem.title} />
        <ListItemSecondaryAction>
          <Button
            size="small"
            style={{ marginRight: "8px" }}
            onClick={handleGroupAddRemove}
            variant={allIn ? "contained" : "outlined"}
            color={allIn ? "primary" : "default"}
          >
            {`${allIn ? "EVERYONE" : someIn ? "SOME" : "NO ONE"}`}
          </Button>
          <RotatingArrowButton
            direction="ccw"
            expanded={expanded}
            onClick={() => setExpanded(old => !old)}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={expanded}>
        <ListItem>
          {timeItem.people && timeItem && timeItem.id && event && (
            <AvatarGroupList
              timeItemId={timeItem.id}
              peopleOnThisTimeItem={timeItem.people}
              peopleOnThisEvent={event.memberIds || []}
            />
          )}
        </ListItem>
      </Collapse>
    </>
  );
};

const AvatarGroupList = ({
  peopleOnThisTimeItem,
  peopleOnThisEvent,
  timeItemId
}: {
  peopleOnThisTimeItem: string[];
  peopleOnThisEvent: string[];
  timeItemId: string;
}) => {
  const { groups } = useGroups();

  return (
    <List>
      {groups.map(group => {
        if (!group || !group.members) return null;
        if (!group.members.find(memId => peopleOnThisEvent.includes(memId)))
          return null;
        return (
          <GroupListItem
            timeItemId={timeItemId}
            key={group.id}
            group={group}
            memberIds={group.members.filter(id =>
              peopleOnThisEvent.includes(id)
            )}
            peopleOnThisTimeItem={peopleOnThisTimeItem}
          />
        );
      })}
    </List>
  );
};

const GroupListItem = ({
  memberIds,
  peopleOnThisTimeItem,
  group,
  timeItemId
}: {
  memberIds: string[];
  peopleOnThisTimeItem: string[];
  group: Group;
  timeItemId: string;
}) => {
  const { allPeopleObj } = usePeople();
  const { doTogglePersonInEventTimeItem } = useFirebaseCtx();
  const { event } = useEventCtx();
  const { changeTimeItemPeople } = useEventTimeItems(event.id);
  const wholeGroupIn =
    group.members &&
    group.members.every(
      mem =>
        peopleOnThisTimeItem.includes(mem) || !event.memberIds.includes(mem)
    );

  const handleGroupAddRemove = () => {
    if (!group || !group.members || !group.members.length) return null;
    console.log(
      `${wholeGroupIn ? "removing" : "adding"} members ${group.members}`
    );
    changeTimeItemPeople(timeItemId, group.members, !wholeGroupIn);
  };
  const handleAddRemoveSingle = (personId: string, adding: boolean) => {
    doTogglePersonInEventTimeItem(event.id, timeItemId, personId, adding);
  };
  return (
    <ListItem divider style={{ padding: "4px" }}>
      <Button
        onClick={handleGroupAddRemove}
        variant={wholeGroupIn ? "contained" : "outlined"}
      >
        {group.name}
      </Button>
      <div style={{ width: "100%", overflow: "scroll" }}>
        {memberIds.map(memberId => {
          const person = allPeopleObj && allPeopleObj[memberId];
          if (!person) return null;
          const isOn = peopleOnThisTimeItem.includes(memberId);
          return (
            <CircleAvatarToggle
              person={person}
              key={memberId}
              isOn={isOn}
              onClick={() => {
                handleAddRemoveSingle(memberId, !isOn);
              }}
            />
          );
        })}
      </div>
    </ListItem>
  );
};
