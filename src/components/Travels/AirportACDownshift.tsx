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
import styled from "styled-components";
import { ArrowDropDown } from "@material-ui/icons";
import { AirportResult } from "../../apis/amadeus.types";
import ShowMe from "../../utils/ShowMe";
import { useAmadeus } from "../../apis/Amadeus";

const AirportACDownshift = ({
  onSelect,
  closeAirports,
  arriving,
  meta
}: {
  onSelect: (ap: AirportResult) => void;
  closeAirports?: (AirportResult | undefined)[];
  arriving?: boolean;
  meta?: any;
}) => {
  const [airports, setAirports] = useState<(AirportResult | undefined)[]>([]);

  const [searchString, setSearchString] = useState("");

  const { getAirportsByKeyword } = useAmadeus();

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
    if (searchString && searchString.length > 2 && searchString.length < 10) {
      dbApCall.current(searchString, active);
    }
    return () => {
      active = false;
    };
  }, [searchString, initialAirports]);
  return (
    <>
      <Downshift
        onInputValueChange={setSearchString}
        itemToString={(item: AirportResult) =>
          item ? `${item.iataCode} - ${item.detailedName}` : ""
        }
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
                  error={meta && meta.dirty && !!meta.error}
                  helperText={meta && meta.dirty && meta.error}
                  label={arriving ? "search TO airport" : "search FROM airport"}
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
                  {airports.map((ap, index) => {
                    if (!ap) return null;
                    return (
                      <AirportListItem
                        key={ap.iataCode}
                        {...{ ap, index, highlightedIndex, getItemProps }}
                      />
                    );
                  })}
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
}
const AirportListItem = ({
  ap,
  index,
  getItemProps,
  highlightedIndex
}: IAirportListItem) => {
  return (
    <ListItem
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
        primary={ap.name}
        secondary={ap.detailedName}
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
