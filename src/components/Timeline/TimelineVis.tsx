import React, { useState, useRef, useEffect, useMemo } from "react";
//@ts-ignore
import Timeline from "react-visjs-timeline";
import { RouteComponentProps } from "react-router-dom";
import moment, { Moment } from "moment";
//@ts-ignore
import elementToString from "react-element-to-jsx-string";
import { Typography, Button } from "@material-ui/core";
import { useTours } from "../Tours/useTours";
import { useEvents } from "../Events/useEvents";
import { usePeople } from "../People/usePeople";
import ShowMe from "../../utils/ShowMe";

const TimelineVis = (props: RouteComponentProps) => {
  console.log("rendering timeline vis");
  const timelineRef = useRef();
  const { tours } = useTours();
  const { events } = useEvents("nViZR8fqTgvoSuQO6Fil");
  const { allPeople } = usePeople();
  //@ts-ignore
  const { date } = props.match.params;
  const [groups, setGroups] = useState([
    {
      id: "travel",
      content: "Travel"
    },
    {
      id: "events",
      content: "Events"
    }
  ]);

  useEffect(() => {
    if (allPeople && allPeople.length) {
      setGroups(old => [
        ...old,
        ...allPeople.map(
          person =>
            person && {
              id: person.id,
              content: person.displayName,
              lastName: person.lastName
            }
        )
      ]);
    }
  }, [allPeople]);
  const zoomMin = 1000 * 60 * 60; // one hour
  const zoomMax = 1000 * 60 * 60 * 24; // one day

  const groupOrder = (a: any, b: any) => {
    if (a.id === "events") return -1;
    if (a.id === "travel") return -1;
    return a.lastName < b.lastName ? -1 : 1;
  };

  const options = {
    width: "100%",
    // height: "300px",
    // clickToUse: true,
    stack: false,
    showMajorLabels: true,
    showCurrentTime: true,
    zoomMin,
    zoomMax,
    type: "background",
    start: moment().startOf("day"),
    end: moment().endOf("day"),
    orientation: {
      axis: "top"
    },
    format: {
      minorLabels: {
        minute: "h:mma",
        hour: "ha"
      }
    },
    groupOrder
  };

  type ChartItem = {
    id: string | undefined;
    start: Moment;
    end: Moment;
    content: string;
    group: string;
    type: string;
    style: string;
  };
  const eventItems: ChartItem[] =
    (events &&
      events.map(event => {
        return {
          id: event.id,
          start: moment(event.startTime),
          end: moment(event.startTime).add(2, "hours"),
          content: event.locBasic.shortName,
          group: "events",
          type: "range",
          style: `background-color: lightblue;`
        };
      })) ||
    [];

  const eventPeopleItems =
    (events &&
      events.reduce((arr: ChartItem[], event) => {
        event.memberIds &&
          event.memberIds.forEach(memberId => {
            arr.push({
              id: `${event.id}-${memberId}`,
              start: moment(event.startTime),
              end: moment(event.startTime).add(2, "hours"),
              content: event.locBasic.shortName,
              group: memberId,
              type: "range",
              style: `background-color: yellow;`
            });
          });
        return arr;
      }, [])) ||
    [];

  const clickHandler = (props: any) => {
    console.log("click props", props);
  };
  const dblClickHandler = (props: any) => {
    console.log("add a thing to", props.snappedTime.format());
  };

  // jsx
  const items = useMemo(() => {
    return [...eventItems, ...eventPeopleItems];
  }, [eventItems, eventPeopleItems]);

  return (
    <div>
      <h3>Timeline {date}</h3>
      <Timeline
        ref={timelineRef}
        options={options}
        items={items}
        groups={groups}
        clickHandler={clickHandler}
        doubleClickHandler={dblClickHandler}
      />
      <ShowMe obj={allPeople} name="allPeople" />
    </div>
  );
};

export default TimelineVis;

// const items = [
//   {
//     id: "item1",
//     start: moment(),
//     end: moment().add(2, "hour"),
//     content: "item 1",
//     group: 2,
//     type: "range"
//   },
//   {
//     id: "item2",
//     start: moment(),
//     end: moment().add(3, "hour"),
//     content: "item 2",
//     group: 1,
//     type: "range"
//   },
//   {
//     id: "item3c",
//     start: moment(),
//     end: moment().add(1, "hour"),
//     content: "item 3c",
//     group: 3,
//     subgroup: 1,
//     type: "range"
//   },
//   {
//     id: "item3a",
//     start: moment().subtract(1, "hour"),
//     end: moment(),
//     content: "item 3a",
//     group: 3,
//     subgroup: 2,
//     type: "range"
//   },
//   {
//     id: "item3b",
//     start: moment().add(2, "hour"),
//     end: moment().add(5, "hour"),
//     content: "item 3b",
//     group: 3,
//     subgroup: 2,
//     type: "range"
//   },
//   {
//     id: "item3balso",
//     start: moment().add(3, "hour"),
//     end: moment().add(6, "hour"),
//     content: "3b alsop",
//     group: 3,
//     subgroup: 2,
//     type: "range"
//   }
// ];
