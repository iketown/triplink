import React, { useEffect, useState, useRef } from "react";
import { useAmadeus } from "../../apis/Amadeus";
import { AirportResult } from "../../apis/amadeus.types";
import {
  TextField,
  Grid,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  List
} from "@material-ui/core";
import { LocationOn } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import ReactAutocomplete from "react-autocomplete";
import ShowMe from "../../utils/ShowMe";
import { debounce } from "lodash";

//
//
export const AirportAC = () => {
  const [searchString, setSearchString] = useState("");
  const [airportResults, setAirportsResults] = useState<AirportResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getAirportsByKeyword } = useAmadeus();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };
  const dbApCall = useRef(
    debounce(
      (searchString: string, active: boolean) => {
        getAirportsByKeyword(searchString).then(response => {
          if (active && response) {
            setAirportsResults(response);
          }
          setLoading(false);
        });
      },
      300,
      { maxWait: 1000 }
    )
  );

  useEffect(() => {
    let active = true;
    if (searchString && searchString.length > 2) {
      setLoading(true);
      dbApCall.current(searchString, active);
    }
    return () => {
      active = false;
    };
  }, [searchString]);

  // useEffect(() => {
  //   if (searchString && searchString.length > 2) {
  //     getAirportsByKeyword(searchString).then(response => {
  //       setAirportsResults(response);
  //     });
  //   }
  // }, [searchString]);

  return (
    <>
      <Autocomplete
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        open={open}
        autoHighlight
        options={airportResults}
        loading={loading}
        groupBy={(ap: AirportResult) => ap.address.stateCode}
        // debug
        renderOption={(ap: AirportResult, state) => {
          console.log("ap", ap, state);
          return (
            <Grid container>
              <Grid
                item
                style={{
                  padding: "0 1rem 0 0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Typography variant="subtitle1">{ap.iataCode}</Typography>
              </Grid>
              <Grid xs item>
                <ListItemText
                  primary={ap.name}
                  secondaryTypographyProps={{}}
                  secondary={`${ap.address.cityName} ${ap.address.stateCode ||
                    ""} ${ap.address.countryName}`}
                />
              </Grid>
            </Grid>
          );
        }}
        getOptionLabel={(ap: AirportResult) =>
          `${ap.iataCode} - ${ap.address.cityName} ${ap.address.stateCode ||
            ""} ${ap.address.countryName}`
        }
        renderInput={params => {
          return (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          );
        }}
      />

      <ShowMe obj={airportResults} name="airportResults" noModal />
    </>
  );
};

export default AirportAC;
