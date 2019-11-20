import React, { useState, Fragment } from "react";
import styled from "styled-components";
import ShowMe from "../../utils/ShowMe";
import { useTours } from "../Tours/useTours";
import { useEvents } from "../Events/useEvents";
import { Tour } from "../Tours/types";
import { usePeople } from "../People/usePeople";
import moment from "moment-timezone";
//
//
interface StyledGridProps {
  rows: number;
  columns?: string[];
}
const StyledGrid = styled.div<StyledGridProps>`
  display: grid;
  grid-template-rows: [times] 1fr [events] 1fr repeat(${p => p.rows}, auto);
  grid-template-columns: [name] 1fr [wake] 1fr ${p =>
      p.columns && p.columns.map(name => `[${name}] max-content `)} [sleep] 1fr;
`;

const DayGrid = ({ date, tour }: { date: string; tour: Tour }) => {
  const { eventsObj } = useEvents(tour.id);
  const { allPeople } = usePeople();
  const dayEvents = eventsObj[date];
  const people = tour.tourMembers.map(personId =>
    allPeople.find(person => person.id === personId)
  );
  const getHours = (start: string, timezone?: string) => {
    const _hoursObj = {};
    if (timezone) {
      moment.tz.setDefault(timezone);
    }
    const time1 = moment(start)
      .startOf("hour")
      .subtract(1, "hour");
    const endOfDay = moment(start).endOf("day");
    let latestTime = time1.clone();
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let index = 0;
    while (latestTime.isSameOrBefore(endOfDay) && index < 50) {
      //@ts-ignore
      _hoursObj[latestTime.format()] = letters[index];
      latestTime.add(30, "minutes");
      index++;
    }
    return _hoursObj;
  };

  let hoursObj = {};
  if (dayEvents && dayEvents.length) {
    const firstEvent = dayEvents[0];
    hoursObj = getHours(firstEvent.startTime, firstEvent.locBasic.timeZoneId);
    console.log("hoursObj", hoursObj);
  }
  return (
    <>
      <StyledGrid rows={4} columns={Object.values(hoursObj)}>
        <div style={{ gridColumn: "wake" }}>Wake</div>
        {Object.entries(hoursObj).map(([datetime, colName]) => {
          console.log("time", datetime, colName);
          return (
            <div
              //@ts-ignore
              style={{
                gridRow: "times",
                gridColumn: colName,
                margin: "0 5px"
              }}
            >
              {moment(datetime).format("h:mm")}
            </div>
          );
        })}
        <div style={{ gridColumn: "sleep" }}>Sleep</div>
        {people.map((person, index) => {
          if (person) {
            return (
              <Fragment key={person.id}>
                <div style={{ gridRow: index + 3 }}>{person.displayName}</div>
              </Fragment>
            );
          }
        })}
        {dayEvents && dayEvents.length && (
          <div
            style={{
              gridRow: "events",
              //@ts-ignore
              gridColumn: hoursObj[dayEvents[0].startTime]
            }}
          >
            event
          </div>
        )}
      </StyledGrid>
      <ShowMe obj={tour} name="tour" />
      <ShowMe obj={people} name="people" />
      <ShowMe obj={dayEvents} name="dayEvents" noModal />
    </>
  );
};

export default DayGrid;
