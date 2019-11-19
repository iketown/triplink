import React, { useState, useEffect } from "react";
import ShowMe from "../../utils/ShowMe";
import { Grid, Button } from "@material-ui/core";
import { useEvents } from "../Events/useEvents";
import GoogMap from "../Maps/GoogMap";
import { amadeusFxns } from "../../apis/Amadeus";
const HotelDialog = ({
  initialValues,
  handleClose
}: {
  initialValues: any;
  handleClose: () => void;
}) => {
  const { eventsObj, events } = useEvents(initialValues.tourId);
  const todayEvents = eventsObj[initialValues.date];
  const [targetLoc, setTargetLoc] = useState();
  const [hotelResults, setHotelResults] = useState([]);
  const { getHotelsNearPoint, getHotelsCityCode } = amadeusFxns();
  useEffect(() => {
    if (todayEvents && todayEvents.length && !targetLoc) {
      setTargetLoc(todayEvents[0].locBasic);
    }
  }, [todayEvents]);
  const handleSearchHotels = async () => {
    if (targetLoc && targetLoc.lat && targetLoc.lng) {
      const response = await getHotelsNearPoint(targetLoc.lat, targetLoc.lng);
      console.log("hotels response", response);
    } else {
      console.log("missing something", targetLoc.lat, targetLoc.lng);
    }
  };

  return (
    <Grid container spacing={2}>
      Hotel Dialog
      <Grid item xs={12} md={6}>
        event picker / hotelinfo viewer
      </Grid>
      <Grid item xs={12} md={6}>
        <Button onClick={handleSearchHotels}>Search Hotels</Button>
      </Grid>
      <Grid item xs={12}>
        <ShowMe obj={initialValues} name="initialValues" noModal />
        <ShowMe obj={targetLoc} name="targetLoc" />
      </Grid>
    </Grid>
  );
};

export default HotelDialog;
