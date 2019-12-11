import React from "react";
import { useDialogCtx } from "../../Dialogs/DialogCtx";
import ShowMe from "../../../utils/ShowMe";

const FlightSearch = () => {
  const { state, dispatch } = useDialogCtx();
  return (
    <div>
      flight search
      <ShowMe obj={state} name="state" />
    </div>
  );
};

export default FlightSearch;
