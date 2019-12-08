import React from "react";
import { List, ListItem, Button } from "@material-ui/core";
import { useEventTimeItems } from "../../../Events/useEvents";
import { Group } from "../../../People/people.types";
//@ts-ignore
import { usePeople, useGroups } from "../../../People/usePeople";
import { useFirebaseCtx } from "../../../Firebase";
import { useEventCtx } from "../../../Events/EventCtx";
import CircleAvatarToggle from "../CircleAvatarToggle";

//
//
const AvatarGroupList = ({
  peopleOnThisTimeItem,
  peopleOnThisTour,
  timeItemId
}: {
  peopleOnThisTimeItem: string[];
  peopleOnThisTour: string[];
  timeItemId: string;
}) => {
  const { groups } = useGroups();

  return (
    <List>
      {groups.map(group => {
        if (!group || !group.members) return null;
        if (!group.members.find(memId => peopleOnThisTour.includes(memId)))
          return null;
        return (
          <GroupListItem
            timeItemId={timeItemId}
            key={group.id}
            group={group}
            memberIds={group.members.filter(id =>
              peopleOnThisTour.includes(id)
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
    group.members.every(mem => peopleOnThisTimeItem.includes(mem));

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
        {allPeopleObj &&
          memberIds.map(memberId => {
            const person = allPeopleObj[memberId];
            if (!person) {
              console.log("missing person", memberId);
              return null;
            }
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

export default AvatarGroupList;
