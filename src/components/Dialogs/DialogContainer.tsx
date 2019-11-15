import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import EventDialog from "../Events/EventDialog";
import TravelDialog from "../Travels/TravelDialog";
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
      <EventDialog initialValues={initialValues} handleClose={handleClose} />
    ),
    travel: (
      <TravelDialog initialValues={initialValues} handleClose={handleClose} />
    ),
    person: () => <div />,
    googPlaces: <GooglePlaceAC setLocation={console.log} />
  };
  const titles = {
    event: "EVENT",
    travel: "TRAVEL",
    person: "PERSON"
  };
  if (!state) return null;
  const { formType } = state;
  return (
    <Dialog maxWidth="md" fullWidth open={state.open} onClose={handleClose}>
      <DialogTitle>{titles[formType]}</DialogTitle>
      <DialogContent>{contents[formType]}</DialogContent>
    </Dialog>
  );
};

export default DialogContainer;