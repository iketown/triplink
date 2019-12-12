import moment from "moment";

export const unixToDayArray = (min: number, max: number, format?: string) => {
  const dayMarkers = [];
  const firstDay = moment.unix(min);
  const lastDay = moment.unix(max);
  let days = moment.duration(lastDay.diff(firstDay)).days();
  const totalDays = days;

  while (days >= 0) {
    const thisDay = firstDay.clone().add(days, "days");
    dayMarkers.unshift({
      moment: thisDay,
      label: thisDay.format(format || "MMM D"),
      dayNumber: unixToDay(thisDay.unix()),
      value: thisDay.unix()
    });
    days--;
  }
  return { dayMarkers, totalDays };
};

export const unixToDay = (unix: number) => {
  return Number(moment.unix(unix).format("YYDDD"));
};
