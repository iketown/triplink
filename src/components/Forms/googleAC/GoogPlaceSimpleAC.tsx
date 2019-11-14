import React, { useRef, useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
//@ts-ignore
import GoogleAC from "react-google-places-autocomplete";
//
//
export const GoogPlaceSimpleAC = ({ onSelect }: { onSelect: any }) => {
  return (
    <div>
      <GoogleAC
        onSelect={onSelect}
        renderInput={(props: any) => {
          return <TextField fullWidth InputProps={props} />;
        }}
      />
    </div>
  );
};

export default GoogPlaceSimpleAC;
