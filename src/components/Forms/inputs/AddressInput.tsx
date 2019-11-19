import React, { useState } from "react";
import { Field } from "react-final-form";
import GooglePlacesAC from "../googleAC/GooglePlacesAC";
import { Typography, Button } from "@material-ui/core";

//
//
const AddressInput = () => {
  const [editing, setEditing] = useState(false);
  return (
    <Field name={"homeAddress"}>
      {({ input }) => {
        const setLocation = (loc: any) => {
          loc.shortName = `${loc.city || loc.town}, ${loc.stateShort ||
            loc.state ||
            loc.country}`;
          input.onChange(loc);
          setEditing(false);
        };
        return editing ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <GooglePlacesAC setLocation={setLocation} label="Home Address" />
            <Button onClick={() => setEditing(false)}>cancel</Button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Typography variant="caption">{input.value.venueName}</Typography>
              <Typography>{input.value.shortName}</Typography>
            </div>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setEditing(true)}
            >
              {input.value ? "change" : "add"} home address
            </Button>
          </div>
        );
      }}
    </Field>
  );
};

export default AddressInput;
