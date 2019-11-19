import React, { useState } from "react";
import { ITravelDialog, TravelTypes } from "./travel.types";
import { useDialogCtx } from "../Dialogs/DialogCtx";
import { Grid, Button } from "@material-ui/core";
import ShowMe from "../../utils/ShowMe";
import { amadeusFxns } from "../../apis/Amadeus";
import DestinationAirportsPicker from "./DestinationAirportsPicker";
import { Form, Field } from "react-final-form";
import FlightForm from "./FlightForm";
//
//
const TravelDialog = ({ initialValues, handleClose }: ITravelDialog) => {
  const { state, dispatch } = useDialogCtx();

  const handleSubmit = (values: any) => {
    console.log("values", values);
  };
  const getForm = () => {
    switch (state.travelType) {
      case TravelTypes.air:
        return <FlightForm />;
      default:
        return (
          <>
            <FlightForm />
          </>
        );
    }
  };
  return (
    <Form onSubmit={handleSubmit} initialValues={state.initialValues}>
      {({ handleSubmit, values }) => {
        return getForm();
      }}
    </Form>
  );
};

export default TravelDialog;
