import React, { useState, useEffect, useRef, useMemo } from "react";
import { debounce } from "lodash";
import Downshift, { GetItemPropsOptions } from "downshift";
import {
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  ListSubheader
} from "@material-ui/core";
import usAirports from "../../constants/usAirports";
import styled from "styled-components";
import { ArrowDropDown } from "@material-ui/icons";
import { AirportResult } from "../../apis/amadeus.types";
import ShowMe from "../../utils/ShowMe";
import { amadeusFxns } from "../../apis/Amadeus";
import { PlaceType } from "../Forms/googleAC/GooglePlacesAC";
import { useGoogleAirport } from "./useGoogAirports";
import { airportResultToLoc, useUSAirports } from "../../utils/locationFxns";
import { LocBasicType } from "../Locations/location.types";

//
//
const AirportACDownshift = ({
  onSelect,
  closeAirports,
  arriving,
  meta,
  disableIata,
  label,
  initialValue
}: {
  onSelect: (ap: LocBasicType) => void;
  closeAirports?: (AirportResult | undefined)[];
  arriving?: boolean;
  meta?: any;
  disableIata?: string;
  label?: string;
  initialValue?: string;
}) => {
  const [airports, setAirports] = useState<(AirportResult | undefined)[]>([]);

  const [searchString, setSearchString] = useState(initialValue);

  const { getAirportsByKeyword } = amadeusFxns();
  const { getLocalResults, localResults } = useUSAirports();
  const initialAirports = useMemo(() => {
    const _initialAirports =
      closeAirports &&
      closeAirports.filter(
        (ap, index, arr) =>
          !!ap &&
          arr.findIndex(_ap => _ap && _ap.iataCode === ap.iataCode) === index
      );
    return _initialAirports || [];
  }, [closeAirports]);

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
    if (
      searchString &&
      searchString.length > 2 &&
      searchString.length < 10 &&
      searchString !== initialValue
    ) {
      // first check local
      if (!getLocalResults(searchString)) {
        dbApCall.current(searchString, active);
      }
    }
    return () => {
      active = false;
    };
  }, [searchString, initialAirports]);
  useEffect(() => {
    if (localResults && localResults.length && airports.length) {
      setAirports([]);
    }
  }, [localResults, airports]);

  const handleSelect = async (ap: any) => {
    console.log("airport", ap);
    if (!ap) return null;
    let formatAP;

    if (ap.locType) {
      formatAP = ap;
    } else {
      formatAP = await airportResultToLoc(ap);
      formatAP.locType = "airport";
    }
    onSelect(formatAP);
  };
  return (
    <>
      <Downshift
        onInputValueChange={setSearchString}
        itemToString={(item: AirportResult) =>
          item ? `${item.iataCode} - ${item.detailedName}` : ""
        }
        onSelect={handleSelect}
        // initialIsOpen={true}
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
            <Grid container {...getRootProps()}>
              <Grid item xs={12}>
                <TextField
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  fullWidth
                  error={meta && meta.dirty && !!meta.error}
                  helperText={meta && meta.dirty && meta.error}
                  label={label || (arriving ? "TO" : "FROM")}
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
              {isOpen && (
                <List
                  dense
                  style={{
                    maxHeight: "15rem",
                    overflow: "scroll"
                  }}
                >
                  {[...localResults, ...airports].map((ap, index) => {
                    if (!ap) return null;
                    return (
                      <AirportListItem
                        disabled={disableIata === ap.iataCode}
                        key={ap.iataCode}
                        {...{ ap, index, highlightedIndex, getItemProps }}
                      />
                    );
                  })}
                  {/* {airports.map((ap, index) => {
                    if (!ap) return null;
                    return (
                      <AirportListItem
                        disabled={disableIata === ap.iataCode}
                        key={ap.iataCode}
                        {...{ ap, index, highlightedIndex, getItemProps }}
                      />
                    );
                  })} */}
                  <ListSubheader>airports near tour events</ListSubheader>
                  {initialAirports
                    .filter(
                      ap =>
                        !airports.find(
                          _ap => ap && _ap && ap.iataCode === _ap.iataCode
                        )
                    )
                    .map((ap, index) => {
                      if (!ap) return null;
                      const indexOffset = airports.length;
                      return (
                        <AirportListItem
                          disabled={disableIata === ap.iataCode}
                          key={ap.iataCode}
                          {...{
                            ap,
                            index: index + indexOffset,
                            highlightedIndex,
                            getItemProps
                          }}
                        />
                      );
                    })}
                </List>
              )}
            </Grid>
          );
        }}
      </Downshift>
    </>
  );
};

interface IAirportListItem {
  ap: AirportResult;
  index: number;
  highlightedIndex: number | null;
  getItemProps: (options: GetItemPropsOptions<any>) => any;
  disabled?: boolean;
}
const AirportListItem = ({
  ap,
  index,
  getItemProps,
  highlightedIndex,
  disabled
}: any) => {
  if (disabled) return null;
  return (
    <ListItem
      disabled={disabled}
      dense
      key={ap.iataCode}
      {...getItemProps({
        key: ap.iataCode,
        index,
        item: ap,
        style: {
          backgroundColor: highlightedIndex === index ? "#ccc" : "#eee"
        }
      })}
    >
      <ListItemAvatar>
        <b>{ap.iataCode}</b>
      </ListItemAvatar>
      <ListItemText
        style={{ margin: 0 }}
        primary={ap.name || ap.shortName}
        primaryTypographyProps={{ noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
        secondary={ap.detailedName || ap.venueName}
      />
    </ListItem>
  );
};

export default AirportACDownshift;

const AirportCode = styled.div`
  border: 1px solid grey;
  border-radius: 50%;
  padding: 5px;
  margin-right: 5px;
`;
