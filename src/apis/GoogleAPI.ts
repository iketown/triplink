import axios from "axios";

export const useGooglePlaces = () => {
  const getPlacesFromString = async (searchString: string) => {
    const { REACT_APP_GOOGLE_PLACES_API_KEY } = process.env;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchString}&key=${REACT_APP_GOOGLE_PLACES_API_KEY}`,
      {
        mode: "no-cors"
      }
    );
    console.log("response", response);
  };
  return { getPlacesFromString };
};
