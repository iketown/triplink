import React, { useEffect, useState } from "react";
import AirportAC from "../../Travels/AirportACDownshift";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Hidden,
  IconButton,
  Grid,
  Tooltip,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Typography,
  Button
} from "@material-ui/core";
import { Half, Full } from "../EventForm";
import { useFormCtx } from "../ScheduleFormComponents/FormCtx";
import { LocBasicType } from "../../Locations/location.types";
import ShowMe from "../../../utils/ShowMe";
import GoogMap from "../../Maps/GoogMap";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment-timezone";
import { airportResultToLoc } from "../../../utils/locationFxns";
import EventLocInput from "../ScheduleFormComponents/EventLocInput";
import AirportLocCard from "./AirportLocCard";
import { FlightPairPanel } from "../FlightGrid";
import {
  FaArrowRight,
  FaArrowLeft,
  FaPlusCircle,
  FaMinus,
  FaMinusCircle
} from "react-icons/fa";
import RotatingArrowButton from "../../Cards/RotatingArrowButton";
import { useDialogCtx } from "../../Dialogs/DialogCtx";
//
//
const FlightForm = () => {
  const { data, handleFieldChange } = useFormCtx();
  const [markerLocs, setMarkerLocs] = useState<LocBasicType[]>([]);
  const [polyLines, setPolyLines] = useState<LocBasicType[][]>([]);

  useEffect(() => {
    const _markerLocs = [];
    const _polyLines = [];
    if (data.startLoc) _markerLocs.push(data.startLoc);
    if (data.endLoc) _markerLocs.push(data.endLoc);
    if (data.startLoc && data.endLoc) {
      _polyLines.push([data.startLoc, data.endLoc]);
    }
    if (data.extraLocs) {
      data.extraLocs.forEach((ap: any) => {
        if (!ap || !ap.lat || !ap.lng) return null;
        if (data.extraLocsSide === "origin" && data.endLoc) {
          _markerLocs.push(ap);
          _polyLines.push([ap, data.endLoc]);
        } else if (data.extraLocsSide === "destination" && data.startLoc) {
          _markerLocs.push(ap);
          _polyLines.push([data.startLoc, ap]);
        }
      });
    }
    setMarkerLocs(_markerLocs);
    setPolyLines(_polyLines);
  }, [data.extraLocs, data.startLoc, data.endLoc]);

  useEffect(() => {
    const startAP = data.startLoc ? data.startLoc.iataCode : "";
    const endAP = data.endLoc ? data.endLoc.iataCode : "";
    const titleString = `${startAP} - ${endAP}`;
    if (titleString !== data.title) {
      handleFieldChange("title", titleString);
    }
  }, [data.startLoc, data.endLoc]);
  useEffect(() => {
    if (data.roundTrip === undefined) handleFieldChange("roundTrip", false);
  }, [data]);

  return (
    <>
      <Grid item xs={12} sm={4}>
        <DatePicker
          label="depart date"
          value={data.startDate}
          onChange={date =>
            date && handleFieldChange("startDate", moment(date).toDate())
          }
        />
      </Grid>
      <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
        <RoundTripSwitch />
      </Grid>

      {data.roundTrip && (
        <Grid item xs={12} sm={4}>
          <DatePicker
            label="return date"
            value={data.endDate}
            onChange={date =>
              date && handleFieldChange("endDate", moment(date).toDate())
            }
          />
        </Grid>
      )}
      <FlightPairPanel origin={data.startLoc} destination={data.endLoc} />
      {data.extraLocsSide &&
        Array.from({ length: data.extraLocsQuantity }).map((_, index) => {
          let origin, destination;
          if (data.extraLocsSide === "origin") {
            destination = data.endLoc;
            origin = data.extraLocs[index];
          } else {
            origin = data.startLoc;
            destination = data.extraLocs[index];
          }
          return (
            <FlightPairPanel
              key={index}
              {...{ origin, destination }}
              extraLoc
              extraLocIndex={index}
            />
          );
        })}
      {data.startLoc && data.endLoc && <AddFlightLinks />}
      <Full>
        <GoogMap polyLines={polyLines} boundsPoints={markerLocs} />
      </Full>
      <Full>
        <ShowMe obj={polyLines} name="polyLines" noModal />
      </Full>
    </>
  );
};

export default FlightForm;

const AddFlightLinks = () => {
  const { state, dispatch } = useDialogCtx();
  const { data, handleFieldChange } = useFormCtx();
  const handleSearchFlights = () => {
    dispatch({ type: "SEARCH_FLIGHTS", data, handleFieldChange });
  };
  const handleAddAP = (side: string) => {
    handleFieldChange("extraLocsSide", side);
    handleFieldChange("extraLocsQuantity", data.extraLocsQuantity + 1 || 1);
    handleFieldChange(
      "extraLocs",
      data.extraLocs ? [...data.extraLocs, null] : [null]
    );
  };
  return (
    <div
      style={{ display: "flex", justifyContent: "space-around", width: "100%" }}
    >
      {data.extraLocsSide !== "destination" ? (
        <Button size="small" onClick={() => handleAddAP("origin")}>
          Add Origin
        </Button>
      ) : (
        <div />
      )}
      <Button
        onClick={handleSearchFlights}
        size="small"
        variant="contained"
        color="primary"
      >
        Search Flights
      </Button>
      {data.extraLocsSide !== "origin" ? (
        <Button size="small" onClick={() => handleAddAP("destination")}>
          Add Destination
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
};

const RoundTripSwitch = () => {
  const { data, handleFieldChange } = useFormCtx();
  const handleChange = (e: any, checked: boolean) => {
    handleFieldChange("roundTrip", checked);
  };

  return (
    <FormControl component="fieldset">
      <FormControlLabel
        value="top"
        control={
          <Switch
            color="primary"
            onChange={handleChange}
            checked={data.roundTrip || false}
          />
        }
        label={data.roundTrip ? "Round Trip" : "One Way"}
        labelPlacement="end"
      />
    </FormControl>
  );
};
