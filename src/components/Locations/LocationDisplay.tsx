import React from "react";
import { LocBasicType } from "./location.types";
import { Typography, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import { Edit } from "@material-ui/icons";

//
//
const LocDisplayDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;
  border: 1px solid gainsboro;
  padding: 5px;
  border-radius: 5px;
`;
const LocationDisplay = ({
  location,
  onChange
}: {
  location: LocBasicType;
  onChange: () => void;
}) => {
  return (
    <LocDisplayDiv>
      <div style={{ marginRight: "5px", maxWidth: "185px" }}>
        <Typography noWrap variant="subtitle1">
          {location.shortName}
        </Typography>
        <Typography noWrap variant="caption">
          {location.venueName}
        </Typography>
      </div>
      <IconButton size="small" onClick={onChange}>
        <Edit />
      </IconButton>
    </LocDisplayDiv>
  );
};

export default LocationDisplay;
