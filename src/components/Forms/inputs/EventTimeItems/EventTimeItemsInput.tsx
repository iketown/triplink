import React, { useState, useMemo } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Collapse,
  ListItemText
} from "@material-ui/core";
import TimeDisplay from "./TimeDisplay";
import AvatarGroupList from "./AvatarGroupList";
import { TimeItem } from "../../../Events/event.types";
import ShowMe from "../../../../utils/ShowMe";
import RotatingArrowButton from "../../../Cards/RotatingArrowButton";
//@ts-ignore
import {
  usePeople,
  useGroups,
  useGroupSubset
} from "../../../People/usePeople";
import { useFirebaseCtx } from "../../../Firebase";
import { useEventCtx } from "../../../Events/EventCtx";
import { useTour } from "../../../Tours/useTours";
import NewTimeItem from "./NewTimeItem";

//
//
const EventTimeItemsInput = () => {
  const { timeItems, event } = useEventCtx();
  const latestTime =
    timeItems.length && timeItems[timeItems.length - 1].startTime;
  let newItemTime = event && event.startTime;
  if (latestTime && latestTime > newItemTime) {
    newItemTime = latestTime;
  }
  console.log("event in ETII", event);
  return (
    <>
      <List dense>
        {timeItems &&
          timeItems.map((timeItem: TimeItem) => {
            return <TimeItemListItem key={timeItem.id} timeItem={timeItem} />;
          })}
        {event && event.startTime && <NewTimeItem newItemTime={newItemTime} />}
      </List>
      {/* <ShowMe obj={timeItems} name="timeItems" noModal /> */}
    </>
  );
};

export default EventTimeItemsInput;

const TimeItemListItem = ({ timeItem }: { timeItem: TimeItem }) => {
  const [expanded, setExpanded] = useState(false);
  const { event, tourId } = useEventCtx();
  const { tour } = useTour(tourId);
  const { getShortSubsetText } = useGroupSubset(tourId);
  const { doUpdateEventTimeItem } = useFirebaseCtx();
  const handleNewTime = (startTime: string) => {
    if (event.id && timeItem.id)
      doUpdateEventTimeItem(event.id, timeItem.id, {
        startTime
      });
  };
  const subsetText = timeItem.people
    ? getShortSubsetText(timeItem.people)
    : undefined;
  return (
    <>
      <ListItem dense>
        <ListItemAvatar>
          <TimeDisplay
            value={timeItem.startTime}
            handleNewTime={handleNewTime}
          />
        </ListItemAvatar>
        <ListItemText primary={timeItem.title} secondary={subsetText} />
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
          {timeItem.people && timeItem && timeItem.id && event && (
            <AvatarGroupList
              timeItemId={timeItem.id}
              peopleOnThisTimeItem={timeItem.people}
              peopleOnThisTour={(tour && tour.tourMembers) || []}
            />
          )}
        </ListItem>
      </Collapse>
    </>
  );
};
