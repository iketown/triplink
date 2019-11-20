import React, { useMemo } from "react";
import { ITourTable } from "./types";
import MaterialTable from "material-table";
import fakeTourData from "./fakeTourData";
import { datePickerDefaultProps } from "@material-ui/pickers/constants/prop-types";
import { useEvents } from "../Events/useEvents";
import ShowMe from "../../utils/ShowMe";
import { getArrayOfDates } from "../../utils/dateFxns";
import moment from "moment";
import { TourEvent } from "../Events/event.types";
import { Typography, Chip, IconButton } from "@material-ui/core";
import {
  StarBorder,
  LocalAirport,
  Hotel,
  HotelOutlined
} from "@material-ui/icons";
import { FaPlus } from "react-icons/fa";
import { useDialogCtx } from "../Dialogs/DialogCtx";
//
//
export const TourTable = ({ tour }: ITourTable) => {
  const { eventsObj, events } = useEvents(tour.id);
  const data = useMemo(() => {
    if (!eventsObj) return null;
    const eventVals = Object.entries(eventsObj);
    if (!eventVals.length) return null;
    let [firstDate] = eventVals[0];
    let [lastDate] = eventVals[eventVals.length - 1];
    const dates = getArrayOfDates({
      first: firstDate,
      last: lastDate
    }).map(date => moment(date).format("YYYY-MM-DD"));

    //
    return dates.map(date => {
      const tableEvents = eventsObj[date] || [];
      // TODO populate flights and hotels into this object
      return { date, tableEvents, flights: [], hotels: [] };
    });
  }, [eventsObj]);
  return (
    <div style={{ maxWidth: "100%" }}>
      {data && (
        <MaterialTable
          // onRowClick={(event, rowData, togglePanel) => togglePanel && togglePanel()}
          detailPanel={[
            { tooltip: "Flights", render: data => <div>FLIGHTS</div> }
          ]}
          columns={[
            { title: "Date", field: "date" },
            {
              title: "Events",
              render: data => <TableEventRender events={data.tableEvents} />
            },
            {
              title: "Flights",
              render: data => (
                <TableFlightRender
                  date={data.date}
                  tourId={tour.id}
                  flights={data.flights}
                />
              )
            },
            {
              title: "Hotels",
              render: data => {
                return (
                  <TableHotelRender
                    date={data.date}
                    tourId={tour.id}
                    hotels={data.hotels}
                  />
                );
              }
            }
          ]}
          //@ts-ignore
          data={data}
          title={
            <div>
              <Typography variant="subtitle2">
                {tour.name.toUpperCase()}
              </Typography>
              <Typography color="textSecondary" variant="caption">
                {`${moment(tour.startDate).format("MMM D")} - ${moment(
                  tour.endDate
                ).format("MMM D, YYYY")}`}
              </Typography>
            </div>
          }
          options={{
            paging: data.length > 10,
            search: true,
            padding: "dense"
          }}
        />
      )}
      <ShowMe obj={tour} name="tour" />
    </div>
  );
};

export default TourTable;

const TableEventRender = ({ events }: { events: TourEvent[] }) => {
  if (!events.length) {
    return <AddButton />;
  }
  return (
    <div>
      {events.map((evt, index, arr) => {
        if (
          index !==
          arr.findIndex(e => e.locBasic.placeId === evt.locBasic.placeId)
        )
          return null;
        const showsLength = arr.filter(
          e => e.locBasic.placeId === evt.locBasic.placeId
        ).length;
        return (
          <Chip
            key={evt.id}
            avatar={<StarBorder />}
            onClick={() => alert("hey now")}
            variant="outlined"
            label={`${evt.locBasic.shortName} ${
              showsLength > 1 ? showsLength : ""
            }`}
          />
        );
      })}
    </div>
  );
};

const TableFlightRender = ({
  flights,
  date,
  tourId
}: {
  flights: any[];
  date: string;
  tourId: string;
}) => {
  const { dispatch } = useDialogCtx();
  const handleClick = () => {
    const initialValues = { date, tourId };
    dispatch({ type: "CREATE_TRAVEL", travelType: "flight", initialValues });
  };
  if (!flights.length) {
    return <AddButton onClick={handleClick} />;
  }
  return <div>flights</div>;
};

const AddButton = ({ onClick = () => {} }: { onClick?: () => void }) => {
  return (
    <IconButton size="small" onClick={onClick}>
      <FaPlus size={15} />
    </IconButton>
  );
};

const TableHotelRender = ({
  date,
  tourId,
  hotels
}: {
  date: any;
  tourId: any;
  hotels: any;
}) => {
  const { dispatch } = useDialogCtx();
  const handleClick = () => {
    const initialValues = {
      date,
      tourId
    };
    dispatch({ type: "CREATE_HOTEL", initialValues });
  };
  return (
    <div>
      <IconButton onClick={handleClick} size="small">
        <Hotel />
      </IconButton>
    </div>
  );
};
