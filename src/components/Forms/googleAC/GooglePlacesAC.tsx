import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import { throttle } from "lodash";
import { geocodeByPlaceId } from "react-places-autocomplete";
import { LinearProgress } from "@material-ui/core";

// function loadScript(src: string, position: HTMLElement | null, id: string) {
//   if (!position) {
//     return;
//   }

//   const script = document.createElement("script");
//   script.setAttribute("async", "");
//   script.setAttribute("id", id);
//   script.src = src;
//   position.appendChild(script);
// }

const autocompleteService = { current: null };

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

export interface PlaceType {
  place_id: string;
  description: string;
  structured_formatting: {
    secondary_text: string;
    main_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      }
    ];
  };
}

export default function GooglePlacesAC({
  setLocation,
  label = "Enter location",
  submitting,
  setSubmitting
}: {
  setLocation?: any;
  label?: string;
  submitting?: boolean;
  setSubmitting?: (val: boolean) => void;
}) {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<PlaceType[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSelect = async (e: any, loc: PlaceType) => {
    setSubmitting && setSubmitting(true);
    const { place_id } = loc;
    await geocodeByPlaceId(place_id)
      .then(([result]) => {
        console.log("result", result);
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();
        let cityObj = result.address_components.find(comp =>
          comp.types.includes("locality")
        );
        let stateObj = result.address_components.find(comp =>
          comp.types.includes("administrative_area_level_1")
        );
        let countryObj = result.address_components.find(comp =>
          comp.types.includes("country")
        );
        let townObj = result.address_components.find(comp =>
          comp.types.includes("postal_town")
        );
        const address = result.formatted_address;
        const city = cityObj && cityObj.long_name;
        const state = stateObj && stateObj.long_name;
        const stateShort = (stateObj && stateObj.short_name) || state;
        const country = countryObj && countryObj.long_name;
        const countryShort = (countryObj && countryObj.short_name) || country;
        const town = (townObj && townObj.long_name) || "";
        setLocation({
          lat,
          lng,
          address,
          city,
          town,
          state,
          stateShort,
          country,
          countryShort,
          placeId: place_id,
          shortName: `${city || town}, ${stateShort || state || ""}${
            countryShort !== "US" ? " " + countryShort : ""
          }`,
          venueName: loc.structured_formatting.main_text
        });
      })
      .catch(err => console.log("error", err));
  };

  const fetch = React.useMemo(
    () =>
      throttle((input: any, callback: any) => {
        (autocompleteService.current as any).getPlacePredictions(
          input,
          callback
        );
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions([]);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: PlaceType[]) => {
      if (active) {
        console.log("raw results", results);
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  return (
    <>
      <Autocomplete
        id="google-map-demo"
        getOptionLabel={option => {
          return option.description;
        }}
        style={{ minWidth: "11rem", width: "100%" }}
        filterOptions={x => x}
        onChange={handleSelect}
        options={options}
        autoComplete
        includeInputInList
        freeSolo
        disableOpenOnFocus
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            fullWidth
            onChange={handleChange}
          />
        )}
        renderOption={option => {
          const matches =
            option.structured_formatting.main_text_matched_substrings;
          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match: any) => [
              match.offset,
              match.offset + match.length
            ])
          );
          return (
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon className={classes.icon} />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
    </>
  );
}
