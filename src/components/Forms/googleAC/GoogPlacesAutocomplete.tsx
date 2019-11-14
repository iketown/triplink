import React, { useState, useRef } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  geocodeByPlaceId
} from "react-places-autocomplete";
import { TextField, Typography, Menu, MenuItem } from "@material-ui/core";
import { ILocationSearchInput } from "./googAC.types";
//
//

export const LocationSearchInput = ({
  setLocation,
  initialAddress = "",
  searchOptions
}: ILocationSearchInput) => {
  const [address, setAddress] = useState(initialAddress);
  const [timeZone, setTimeZone] = useState("");
  const handleChange = (_address: any) => {
    setAddress(_address);
  };

  const handleSelect = (address: any, placeId: string) => {
    console.log("address", address);
    console.log("placeid", placeId);
    setAddress(address);
    geocodeByAddress(address)
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
          placeId,
          venueName: address.split(",")[0]
        });
      })
      .catch(err => console.log("error", err));
  };
  const anchorRef = useRef();
  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
      searchOptions={searchOptions}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <TextField
            fullWidth
            innerRef={ref => (anchorRef.current = ref)}
            variant="outlined"
            {...getInputProps({
              placeholder: "Search Places ...",
              className: "location-search-input"
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}

            {suggestions.map(suggestion => {
              console.log("subgg", suggestion);
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#eee", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style
                  })}
                  // onClick={() => handleSelect(suggestion)}
                >
                  <Typography variant="subtitle1">
                    {suggestion.description}
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
