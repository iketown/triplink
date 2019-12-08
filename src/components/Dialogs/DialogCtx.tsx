import React, { createContext, useContext, useReducer } from "react";
import { id } from "date-fns/esm/locale";
import { TravelTypes } from "../Travels/travel.types";

export type EventValues = {
  startDate: string;
  startTime: string;
  id?: string;
  tourId: string;
  locBasic?: {
    address: string;
    id: string;
    lat: number;
    lng: number;
    shortName: string;
    placeId: string;
    timeZoneId: string;
    venueName: string;
  };
  location?: {
    address: string;
    id: string;
    lat: number;
    lng: number;
    shortName: string;
    placeId: string;
    timeZoneId: string;
    venueName: string;
  };
};
const initialState = {
  open: false,
  formType: "event",
  initialValues: {
    date: "2019-11-10",
    tourId: "D11r5RTlh1OGWY7yPLtV"
  },
  travelType: "flight"
};

// @ts-ignore
const DialogCtx = createContext();

// @ts-ignore
const dialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CLOSE_DIALOG": {
      return { ...state, open: false };
    }
    case "EDIT_EVENT":
    case "CREATE_EVENT": {
      const { initialValues } = action;
      return { ...state, open: true, formType: "event", initialValues };
    }
    case "CREATE_TRAVEL":
    case "EDIT_TRAVEL": {
      const { initialValues, travelType } = action;
      return {
        ...state,
        open: true,
        formType: "travel",
        travelType,
        initialValues
      };
    }
    case "CREATE_HOTEL":
    case "EDIT_HOTEL": {
      const { initialValues } = action;
      return {
        ...state,
        open: true,
        formType: "hotel",
        initialValues
      };
    }
    default:
      return state;
  }
};

type DialogCtxType = {
  state: {
    open: boolean;
    formType: "event" | "travel" | "person";
    initialValues: any;
    travelType?: TravelTypes;
  };
  dispatch: React.Dispatch<any>;
};

// @ts-ignore
export const DialogCtxProvider = props => {
  const [state, dispatch] = useReducer(dialogReducer, initialState);
  return <DialogCtx.Provider value={{ state, dispatch }} {...props} />;
};

export const useDialogCtx = () => {
  const ctx = useContext<DialogCtxType>(DialogCtx);
  if (!ctx)
    throw new Error(
      "usedialogCtx must be a descendant of DialogCtxProvider 😕"
    );
  const { state, dispatch } = ctx;
  return { state, dispatch };
};
