import React from "react";
import { Grid } from "@material-ui/core";
import EventLocInput from "../Forms/inputs/EventLocInput";
import GoogMap from "../Maps/GoogMap";
import { Field } from "react-final-form";
//
//

interface IEventLocationSection {
  location: any;
  label: string;
}

const EventLocationSection = ({ location, label }: IEventLocationSection) => {
  return (
    <Field name="location">
      {({ input, meta }) => {
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <EventLocInput location={input.value} label={label} />
            </Grid>
            <Grid item xs={12} md={6}>
              {input.value && (
                <GoogMap initialZoom={9} markerLocs={[input.value]} />
              )}
            </Grid>
          </Grid>
        );
      }}
    </Field>
  );
};

export default EventLocationSection;
