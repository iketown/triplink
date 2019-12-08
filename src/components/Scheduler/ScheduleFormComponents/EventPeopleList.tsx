import React, { useState, useReducer, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Avatar,
  Checkbox,
  Tooltip,
  ListSubheader
} from "@material-ui/core";
import {
  FaUserFriends,
  FaUser,
  FaUsers,
  FaTimes,
  FaCircle
} from "react-icons/fa";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import EventCard from "./EventCard";
import { useGroups, usePeople } from "../../People/usePeople";
import ShowMe from "../../../utils/ShowMe";
import { Group } from "../../People/people.types";
import CloudAvatar from "../../Images/cloudinary/CloudAvatar";
import { useFormCtx } from "./FormCtx";

type State = { openGroups: string[]; peopleIncluded: string[] };

const reducer = (state: State, action: any) => {
  switch (action.type) {
    case "TOGGLE_GROUP_OPEN": {
      const { open, groupId } = action;
      const newOpenGroups = open
        ? [groupId]
        : state.openGroups.filter(grpId => grpId !== groupId);
      return { ...state, openGroups: newOpenGroups };
    }
    case "SET_OPEN_GROUPS": {
      const { groupIds } = action;
      return { ...state, openGroups: groupIds };
    }
    case "SET_PEOPLE": {
      const { peopleIds } = action;
      return { ...state, peopleIncluded: peopleIds };
    }
    case "TOGGLE_PEOPLE": {
      const { peopleIds }: { peopleIds: string[] } = action;
      const everyoneIn = peopleIds.every(personId =>
        state.peopleIncluded.includes(personId)
      );
      let newPeople = [];
      if (everyoneIn) {
        // remove them all
        newPeople = state.peopleIncluded.filter(
          personId => !peopleIds.includes(personId)
        );
      } else {
        // add them all
        newPeople = Array.from(
          new Set([...state.peopleIncluded, ...peopleIds])
        );
      }
      return { ...state, peopleIncluded: newPeople };
    }
    default:
      return state;
  }
};

const EventPeopleList = () => {
  const [expanded, setExpanded] = useState(false);
  const { groups } = useGroups();
  const { allPeople, allPeopleObj } = usePeople();
  const { data, handleFieldChange } = useFormCtx();

  const initialState: { openGroups: string[]; peopleIncluded: string[] } = {
    openGroups: [],
    peopleIncluded: [...allPeople.map(person => person.id)]
    // this could be a default group instead of everyone.
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    handleFieldChange("people", state.peopleIncluded);
  }, [state.peopleIncluded]);
  const dataPeopleLength = data && data.people && data.people.length;

  useEffect(() => {
    const includedPplLength =
      state && state.peopleIncluded && state.peopleIncluded.length;
    if (dataPeopleLength !== includedPplLength && data && data.people) {
      dispatch({ type: "SET_PEOPLE", peopleIds: data.people });
    }
    if (dataPeopleLength === 0) {
      setExpanded(true);
    }
  }, [dataPeopleLength]);

  const summary = groups.map(group => {
    if (!group.members) return null;
    if (
      group.members.findIndex(memId => state.peopleIncluded.includes(memId)) ===
      -1
    )
      return null;
    if (group.members.every(memId => state.peopleIncluded.includes(memId)))
      return `${group.name}`;
    return `${
      group.members.filter(memId => state.peopleIncluded.includes(memId)).length
    }/${group.members.length} ${group.name}`;
  });
  return (
    <EventCard
      category="who"
      title="People"
      subheader={summary && summary.filter(s => s).join(" & ")}
      {...{ expanded, setExpanded }}
      content={
        <List dense>
          {groups.map(group => {
            if (!group.members || !group.members.length) return null;
            return (
              <PersonGroupListItem
                key={group.id}
                {...{ group, state, dispatch }}
              />
            );
          })}
        </List>
      }
      extraContent={
        false && (
          <div>
            <ShowMe obj={state} name="state" noModal />
            <ShowMe obj={groups} name="groups" />
            <ShowMe obj={allPeople} name="allPeople" />
            <ShowMe obj={allPeopleObj} name="allPeopleObj" />
          </div>
        )
      }
    ></EventCard>
  );
};

export default EventPeopleList;

const PersonGroupListItem = ({
  group,
  state,
  dispatch
}: {
  group: Group;
  state: State;
  dispatch: React.Dispatch<any>;
}) => {
  const open = group.id && state.openGroups.includes(group.id);
  const includedMembers =
    group.members &&
    group.members.filter(memId => state.peopleIncluded.includes(memId));
  let portionOfGroup = "none";
  if (
    includedMembers &&
    group.members &&
    group.members.length &&
    includedMembers.length === group.members.length
  )
    portionOfGroup = "all";
  if (
    includedMembers &&
    group.members &&
    includedMembers.length < group.members.length &&
    includedMembers.length > 0
  )
    portionOfGroup = "some";
  const getGroupIcon = () => {
    switch (portionOfGroup) {
      case "none":
        return <FaTimes />;
      case "some":
        return <FaUserFriends />;
      case "all":
        return <FaUsers />;
      default:
        return <FaCircle />;
    }
  };
  const toggleExpand = () => {
    dispatch({ type: "TOGGLE_GROUP_OPEN", open: !open, groupId: group.id });
  };
  const togglePeople = () => {
    group.members &&
      dispatch({ type: "TOGGLE_PEOPLE", peopleIds: group.members });
  };
  return (
    <>
      <Tooltip
        placement="top"
        title={`${portionOfGroup === "all" ? "REMOVE" : "ADD ALL"} ${
          group.name
        }`}
      >
        <ListItem
          dense
          button
          onClick={togglePeople}
          key={group.id}
          style={{ opacity: portionOfGroup === "none" ? 0.5 : 1 }}
        >
          <ListItemIcon>{getGroupIcon()}</ListItemIcon>
          <ListItemText
            primary={`${group.name} • ${includedMembers &&
              includedMembers.length}/${
              group.members ? group.members.length : ""
            }`}
          />
          <ListItemSecondaryAction>
            <IconButton size="small" onClick={toggleExpand}>
              {open ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </Tooltip>

      <Collapse in={!!open}>
        {group.members &&
          group.members.map(memberId => {
            return (
              <PersonListItem personId={memberId} {...{ state, dispatch }} />
            );
          })}
      </Collapse>
    </>
  );
};

const PersonListItem = ({
  personId,
  state,
  dispatch
}: {
  personId: string;
  state: State;
  dispatch: React.Dispatch<any>;
}) => {
  const { allPeopleObj } = usePeople();
  const person = allPeopleObj && allPeopleObj[personId];
  if (!person) return null;
  const handleCheck = (e: any, checked: boolean) => {
    dispatch({ type: "TOGGLE_PEOPLE", peopleIds: [personId] });
  };
  return (
    <ListItem dense>
      <ListItemAvatar>
        <CloudAvatar publicId={person.avatarPublicId} />
      </ListItemAvatar>
      <ListItemText primary={person.displayName} />
      <ListItemSecondaryAction>
        <Checkbox
          checked={state.peopleIncluded.includes(personId)}
          onChange={handleCheck}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
