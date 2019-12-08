import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import EventDialog from "../Events/EventDialog";
import EventDialogNew from "../Events/EventDialogNew";
import TravelDialog from "../Travels/TravelDialog";
import HotelDialog from "../Hotels/HotelDialog";
import { useDialogCtx } from "./DialogCtx";

import GooglePlaceAC from "../Forms/googleAC/GooglePlacesAC";
export const DialogContainer = () => {
  const { state, dispatch } = useDialogCtx();
  const handleClose = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };
  const { initialValues } = state;
  const contents = {
    event: (
      <EventDialogNew initialValues={initialValues} handleClose={handleClose} />
    ),
    travel: (
      <TravelDialog initialValues={initialValues} handleClose={handleClose} />
    ),
    hotel: (
      <HotelDialog initialValues={initialValues} handleClose={handleClose} />
    ),
    person: () => <div />,
    googPlaces: <GooglePlaceAC setLocation={console.log} />
  };
  const titles = {
    event: "EVENT",
    travel: "TRAVEL",
    person: "PERSON",
    hotel: "HOTEL"
  };
  if (!state) return null;
  const { formType } = state;
  return (
    <Dialog maxWidth="md" fullWidth open={state.open} onClose={handleClose}>
      <DialogContent>{contents[formType]}</DialogContent>
    </Dialog>
  );
};

export default DialogContainer;
