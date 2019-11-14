import React, { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { render } from "react-dom";
import Downshift from "downshift";
import {
  TextField,
  FormControl,
  FormControlLabel,
  Grid,
  Chip,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton
} from "@material-ui/core";
import styled from "styled-components";
import { ArrowDropDown } from "@material-ui/icons";
import { AirportResult } from "../../apis/amadeus.types";
import ShowMe from "../../utils/ShowMe";
import { useAmadeus } from "../../apis/Amadeus";

const AirportACDownshift = ({
  onSelect,
  initialSearchString
}: {
  onSelect: (ap: AirportResult) => void;
  initialSearchString?: string;
}) => {
  const [airports, setAirports] = useState<AirportResult[]>([]);
  const [searchString, setSearchString] = useState(initialSearchString);
  const { getAirportsByKeyword } = useAmadeus();

  const dbApCall = useRef(
    debounce(
      (searchString: string, active: boolean) => {
        getAirportsByKeyword(searchString).then(response => {
          if (active && response) {
            setAirports(response);
          }
        });
      },
      200,
      { maxWait: 500 }
    )
  );
  useEffect(() => {
    let active = true;
    if (searchString === initialSearchString) {
      // auto select the first choice
    }
    if (searchString && searchString.length > 1) {
      dbApCall.current(searchString, active);
    }
    return () => {
      active = false;
    };
  }, [searchString]);

  return (
    <>
      <Downshift
        onInputValueChange={setSearchString}
        itemToString={(item: AirportResult) => (item ? item.detailedName : "")}
        onSelect={onSelect}
        initialIsOpen={true}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
          getRootProps,
          getToggleButtonProps
        }) => {
          return (
            <Grid container spacing={2} {...getRootProps()}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={"search for airport"}
                  {...getInputProps()}
                  InputProps={{
                    endAdornment: (
                      <IconButton {...getToggleButtonProps()} size="small">
                        <ArrowDropDown />
                      </IconButton>
                    )
                  }}
                />
              </Grid>
              {isOpen && airports.length && (
                <List dense>
                  {airports.map((ap, index) => {
                    return (
                      // <Grid key={ap.iataCode} item xs={6}>
                      <ListItem
                        dense
                        key={ap.iataCode}
                        {...getItemProps({
                          key: ap.iataCode,
                          index,
                          item: ap,
                          style: {
                            backgroundColor:
                              highlightedIndex === index ? "gainsboro" : "white"
                          }
                        })}
                      >
                        <ListItemAvatar>
                          <b>{ap.iataCode}</b>
                        </ListItemAvatar>
                        <ListItemText
                          style={{ margin: 0 }}
                          primary={ap.name}
                          secondary={ap.detailedName}
                        />
                      </ListItem>
                      // </Grid>
                    );
                  })}
                </List>
              )}
            </Grid>
          );
        }}
      </Downshift>
      <ShowMe obj={searchString} name="searchString" />
    </>
  );
};

export default AirportACDownshift;

const AirportCode = styled.div`
  border: 1px solid grey;
  border-radius: 50%;
  padding: 5px;
  margin-right: 5px;
`;
