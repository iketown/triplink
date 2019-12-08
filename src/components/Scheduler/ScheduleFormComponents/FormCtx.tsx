import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  Provider
} from "react";
import { FormData } from "../eventFormHelpers";
import { AppointmentModel } from "@devexpress/dx-react-scheduler";

interface IFormCtxProvider {
  children?: any;
  handleFieldChange: (fieldName: string, newValue: any) => void;
  data: AppointmentModel;
}
type FormCtxType = {
  handleFieldChange: (fieldName: string, newValue: any) => void;
  data: FormData;
  timeZone?: string;
};
//@ts-ignore
const FormCtx = createContext<FormCtxType>();

export const FormCtxProvider = ({
  children,
  handleFieldChange,
  data
}: IFormCtxProvider) => {
  const [timeZone, setTimeZone] = useState();
  useEffect(() => {
    if (data.startLoc && data.startLoc.timeZoneId) {
      setTimeZone(data.startLoc.timeZoneId);
    }
  }, [data.startLoc]);

  return (
    <FormCtx.Provider
      value={{ handleFieldChange, data, timeZone }}
      {...{ children }}
    />
  );
};
export const useFormCtx = () => {
  const ctx = useContext(FormCtx);
  if (!ctx)
    throw new Error("useFormCtx must be a descendant of FormCtxProvider");
  //@ts-ignore
  const { handleFieldChange, data, timeZone } = ctx;
  return { handleFieldChange, data, timeZone };
};
