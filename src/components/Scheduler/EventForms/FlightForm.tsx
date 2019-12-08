import React, { useEffect, useState } from "react";
import AirportAC from "../../Travels/AirportACDownshift";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Hidden,
  IconButton,
  Grid,
  Tooltip,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemIcon,
  ListSubheader
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

import {
  FaArrowRight,
  FaArrowLeft,
  FaPlusCircle,
  FaMinus,
  FaMinusCircle
} from "react-icons/fa";
import RotatingArrowButton from "../../Cards/RotatingArrowButton";
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
    if (data.extraAirports) {
      data.extraAirports.forEach((ap: any) => {
        if (!ap || !ap.lat || !ap.lng) return null;
        if (data.extraSide === "dep" && data.endLoc) {
          _markerLocs.push(ap);
          _polyLines.push([ap, data.endLoc]);
        } else if (data.extraSide === "arr" && data.startLoc) {
          _markerLocs.push(ap);
          _polyLines.push([data.startLoc, ap]);
        }
      });
    }
    setMarkerLocs(_markerLocs);
    setPolyLines(_polyLines);
  }, [data.extraAirports, data.startLoc, data.endLoc]);

  useEffect(() => {
    const startAP = data.startLoc ? data.startLoc.iataCode : "";
    const endAP = data.endLoc ? data.endLoc.iataCode : "";
    const titleString = `${startAP} - ${endAP}`;
    if (titleString !== data.title) {
      handleFieldChange("title", titleString);
    }
  }, [data.startLoc, data.endLoc]);
  useEffect(() => {
    if (!data.legs) handleFieldChange("legs", "oneWay");
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
        <RoundTripRadio key={data.legs} />
      </Grid>

      {data.legs === "roundTrip" && (
        <Grid xs={12} sm={4}>
          <DatePicker
            label="return date"
            value={data.endDate}
            onChange={date =>
              date && handleFieldChange("endDate", moment(date).toDate())
            }
          />
        </Grid>
      )}

      <Grid
        item
        xs={12}
        sm={5}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <AirportLocBox name={"startLoc"} />
        <ExtraAirportsLocBoxes side="dep" />
      </Grid>

      <Hidden xsDown>
        <Grid item sm={2}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
            }}
          >
            <FaArrowRight />
            {data.legs === "roundTrip" && <FaArrowLeft />}
          </div>
        </Grid>
      </Hidden>

      <Grid
        item
        xs={12}
        sm={5}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <AirportLocBox name={"endLoc"} />
        <ExtraAirportsLocBoxes side="arr" />
      </Grid>

      <Full>
        <GoogMap polyLines={polyLines} boundsPoints={markerLocs} />
      </Full>
    </>
  );
};

export default FlightForm;

const RoundTripRadio = () => {
  const { data, handleFieldChange } = useFormCtx();
  const handleChange = (e: any, value: string) => {
    handleFieldChange("legs", value);
  };
  useEffect(() => {
    if (!data.legs) handleFieldChange("legs", "oneWay");
  }, [data, data.legs]);
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="gender"
        name="gender1"
        value={data.legs}
        onChange={handleChange}
      >
        <FormControlLabel value="oneWay" control={<Radio />} label="One Way" />
        <FormControlLabel
          value="roundTrip"
          control={<Radio />}
          label="Round Trip"
        />
      </RadioGroup>
    </FormControl>
  );
};

const AirportLocBox = ({ name }: { name: string }) => {
  const { data, handleFieldChange } = useFormCtx();

  return (
    <>
      <EventLocInput
        locCategory="airport"
        location={data[name]}
        label="destination airport"
        setLocation={loc => handleFieldChange(name, loc)}
      />
    </>
  );
};

const ExtraAirportsLocBoxes = ({ side }: { side: "arr" | "dep" }) => {
  const { data, handleFieldChange } = useFormCtx();
  if (data.extraSide && data.extraSide !== side) return null;
  const handleClick = () => {
    handleFieldChange("extraSide", side);
    if (data.extraAirports) {
      handleFieldChange("extraAirports", [...data.extraAirports, null]);
    } else {
      handleFieldChange("extraAirports", [null]);
    }
  };

  return (
    <div>
      {data.extraAirports &&
        data.extraAirports.map((ap: any, index: number) => {
          return <ExtraAirportLocBox key={index} index={index} />;
        })}
      <Tooltip
        title={`add ${side === "arr" ? "ARRIVAL" : "DEPARTURE"} airport`}
      >
        <IconButton onClick={handleClick} size="small">
          <FaPlusCircle />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const ExtraAirportLocBox = ({ index }: { index: number }) => {
  const { data, handleFieldChange } = useFormCtx();

  const handleLoc = (loc: any) => {
    const newExtraAirports = data.extraAirports ? [...data.extraAirports] : [];
    newExtraAirports[index] = loc;
    handleFieldChange("extraAirports", newExtraAirports);
  };
  const handleDelete = () => {
    const { extraAirports = [] } = data;
    const newExtraAirports = [
      ...extraAirports.slice(0, index),
      ...extraAirports.slice(index + 1)
    ];
    handleFieldChange("extraAirports", newExtraAirports);
    if (!newExtraAirports.length) handleFieldChange("extraSide", null);
  };
  return (
    <div
      style={{
        display: "flex",
        marginTop: "4px",
        alignItems: "center"
      }}
    >
      <AirportLocCard
        location={data.extraAirports[index]}
        {...{ index, handleDelete }}
        setLocation={handleLoc}
        deletable
      />
      {/* <EventLocInput
        locCategory="airport"
        location={data.extraAirports[index]}
        label="destination airport"
        setLocation={handleLoc}
      /> */}
      {/* <IconButton onClick={handleDelete} size="small">
        <FaMinusCircle color="red" />
      </IconButton> */}
    </div>
  );
};
