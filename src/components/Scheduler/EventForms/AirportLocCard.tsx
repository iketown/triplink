import React, { useState } from "react";
import RotatingArrowButton from "../../Cards/RotatingArrowButton";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Button
} from "@material-ui/core";
import EventLocInput from "../ScheduleFormComponents/EventLocInput";
import { LocBasicType } from "../../Locations/location.types";

///
//
const AirportLocCard = ({
  index,
  location,
  setLocation,
  deletable,
  handleDelete
}: {
  index: number;
  deletable?: boolean;
  location?: LocBasicType;
  setLocation: (loc: LocBasicType) => void;
  handleDelete: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <EventLocInput locCategory="airport" {...{ location }} />
        <RotatingArrowButton
          expanded={expanded}
          onClick={() => setExpanded(old => !old)}
        />
      </div>
      <Collapse in={expanded}>
        <CardContent>people list</CardContent>
        <CardActions>
          <Button onClick={handleDelete} variant="outlined" color="secondary">
            Remove Flight
          </Button>
        </CardActions>
      </Collapse>
    </Card>
  );
};

export default AirportLocCard;
