import React, { useState, useEffect } from "react";
import TourForm from "./TourForm";
import TourCard, { NewTourCard } from "./TourCard";
import { Typography } from "@material-ui/core";
import { useFirebaseCtx } from "../Firebase";
import ShowMe from "../../utils/ShowMe";
import useAuth from "../Account/UserCtx";
import moment from "moment";
import { useTours, useFutureTours } from "./useTours";
import { Tour } from "./types";
import { Button } from "@material-ui/core";
import { useDialogCtx } from "../Dialogs/DialogCtx";

const Tours = () => {
  const { futureTours } = useFutureTours();
  const { state, dispatch } = useDialogCtx();
  const handleEditTours = () => {
    dispatch({ type: "EDIT_TOURS", inititalValues: { foo: "bar" } });
  };
  return (
    <div>
      <Typography variant="h3">TOURS</Typography>
      {futureTours.map((tour: Tour) => {
        return <TourCard key={tour.id} {...{ tour }} />;
      })}
      <NewTourCard />
      <Button onClick={handleEditTours} variant="contained" color="primary">
        EDIT TOURS
      </Button>
      <ShowMe obj={futureTours} noModal name="futureTours" />
    </div>
  );
};

export default Tours;
