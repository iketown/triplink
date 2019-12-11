import React, { useState } from "react";
import {
  ExpansionPanel,
  Typography,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary as MuiExpansionPanelSummary,
  Button
} from "@material-ui/core";
import { ExpandMore, ArrowRight } from "@material-ui/icons";
import {
  makeStyles,
  createStyles,
  Theme,
  withStyles
} from "@material-ui/core/styles";
import {
  FaPlaneArrival,
  FaPlaneDeparture,
  FaArrowRight,
  FaUser,
  FaPlane,
  FaArrowLeft
} from "react-icons/fa";
import { usePeople } from "../People/usePeople";
import { LocationType } from "../Locations/location.types";
import { useFormCtx } from "./ScheduleFormComponents/FormCtx";
import AirportAC from "../Travels/AirportACDownshift";
//
//

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginBottom: "5px"
    },
    airport: {
      display: "flex",
      alignItems: "flex-end",
      flexBasis: "45%",
      flexShrink: 0,
      overflow: "hidden"
    },
    arrow: {
      margin: "0 4px",
      display: "flex"
    },
    airportIcon: {
      fontSize: "21px",
      color: "rgba(0,0,0,.4)",
      margin: "0 4px"
    },
    airportCode: {
      marginRight: "5px"
    },
    airportCity: {},
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary
    },
    peopleList: {
      width: "100%"
    }
  })
);

const ExpansionPanelSummary = withStyles({
  content: { justifyContent: "space-around" }
})(MuiExpansionPanelSummary);

export const FlightPairPanel = ({
  origin,
  destination,
  extraLocIndex,
  extraLoc
}: {
  origin: LocationType;
  destination: LocationType;
  extraLocIndex?: number;
  extraLoc?: boolean;
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={classes.root}>
      <CityPairPanel
        {...{
          expanded,
          setExpanded,
          origin,
          destination,
          extraLoc,
          extraLocIndex
        }}
      />
    </div>
  );
};

interface ICityPairPanel {
  details?: any;
  origin: LocationType;
  destination: LocationType;
  extraLocIndex?: number;
  extraLoc?: boolean;
}

export const CityPairPanel = ({
  origin,
  destination,
  details,
  extraLoc,
  extraLocIndex
}: ICityPairPanel) => {
  const classes = useStyles();
  const { data, handleFieldChange } = useFormCtx();
  const [expanded, setExpanded] = useState(false);

  const handleAirport = (ap: LocationType, field?: string | number) => {
    if (!extraLoc) handleFieldChange(field, ap);
    if (extraLoc && typeof field === "number")
      handleFieldChange("extraLocs", [
        ...data.extraLocs.slice(0, field as number),
        ap,
        ...data.extraLocs.slice((field as number) + 1)
      ]);
  };
  const handleRemove = () => {
    function removeExtraLoc(indexToRemove: number) {
      const newExtraLocs = data.extraLocs.filter(
        (loc: any, index: number) => index !== indexToRemove
      );
      if (newExtraLocs.length === 0) handleFieldChange("extraLocsSide", null);
      handleFieldChange("extraLocs", newExtraLocs);
      handleFieldChange("extraLocsQuantity", newExtraLocs.length);
    }
    if (extraLoc) {
      extraLocIndex && removeExtraLoc(extraLocIndex);
    } else {
      // move top extra to main
      if (data.extraLocsSide === "origin") {
        handleFieldChange("startLoc", data.extraLocs[0]);
        removeExtraLoc(0);
      } else {
        handleFieldChange("endLoc", data.extraLocs[0]);
        removeExtraLoc(0);
      }
    }
  };
  return (
    <div className={classes.root}>
      <ExpansionPanel
        {...{ expanded }}
        onChange={(e: any, isExp: boolean) => setExpanded(isExp)}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <div className={classes.airport}>
            <FaPlaneDeparture className={classes.airportIcon} />
            <AirportDisplayOrInput
              location={origin}
              onSelect={(ap: any) =>
                handleAirport(ap, extraLoc ? extraLocIndex : "startLoc")
              }
              label="FROM"
            />
          </div>

          <div className={classes.airport}>
            <FaPlaneArrival className={classes.airportIcon} />
            <AirportDisplayOrInput
              location={destination}
              onSelect={(ap: any) =>
                handleAirport(ap, extraLoc ? extraLocIndex : "endLoc")
              }
              label="TO"
            />
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>{details || ""}</ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button size="small" variant="outlined" color="primary">
            search flights
          </Button>
          <Button
            onClick={handleRemove}
            size="small"
            variant="outlined"
            color="secondary"
          >
            remove
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
  );
};

const AirportDisplayOrInput = ({
  location,
  onSelect,
  label
}: {
  location?: LocationType;
  onSelect: (loc: any) => void;
  label: string;
}) => {
  const classes = useStyles();
  return location ? (
    <>
      <Typography className={classes.airportCode}>
        <b>{location.iataCode}</b>
      </Typography>
      <Typography noWrap color="textSecondary" className={classes.airportCity}>
        {`${location.city}, ${location.state}`}
      </Typography>
    </>
  ) : (
    <AirportAC {...{ label, onSelect }} />
  );
};

export default CityPairPanel;
