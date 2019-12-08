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

const Tours = () => {
  const { futureTours } = useFutureTours();
  return (
    <div>
      <Typography variant="h3">TOURS</Typography>
      {futureTours.map((tour: Tour) => {
        return <TourCard key={tour.id} {...{ tour }} />;
      })}
      <NewTourCard />
      <ShowMe obj={futureTours} noModal name="futureTours" />
    </div>
  );
};

export default Tours;
