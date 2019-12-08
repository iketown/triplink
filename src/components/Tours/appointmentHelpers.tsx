import moment from "moment-timezone";

export const getOffsetEvent = (event: any) => {
  const offsetEvent = { ...event };
  const timeZone = event.startLoc && event.startLoc.timeZoneId;
  const myOffset = new Date().getTimezoneOffset();
  const eventOffset = -moment(event.startDate)
    .tz(timeZone)
    .utcOffset();
  if (myOffset !== eventOffset) {
    const offset = myOffset - eventOffset;
    offsetEvent.startDate = moment(event.startDate)
      .add(offset, "minutes")
      .toDate();
    offsetEvent.endDate = moment(event.endDate)
      .add(offset, "minutes")
      .toDate();
  }
  return offsetEvent;
};

export const getOffsetTimes = (
  event: any
): { offsetStart?: Date; offsetEnd?: Date } => {
  const offsetEvent = { ...event };
  const timeZone = event.startLoc && event.startLoc.timeZoneId;
  const myOffset = new Date().getTimezoneOffset();
  const eventOffset = -moment(event.startDate)
    .tz(timeZone)
    .utcOffset();

  let offsetStart;
  let offsetEnd;

  if (myOffset !== eventOffset) {
    const offset = myOffset - eventOffset;
    offsetStart = moment(event.startDate)
      .add(offset, "minutes")
      .toDate();
    offsetEnd = moment(event.endDate)
      .add(offset, "minutes")
      .toDate();
  }
  return { offsetStart, offsetEnd };
};
