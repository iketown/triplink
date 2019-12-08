import React from "react";
import { DatePicker, MaterialUiPickersDate } from "@material-ui/pickers";
import { Field } from "react-final-form";

//
//

export const DateInput = ({
  name,
  label,
  shouldDisableDate
}: {
  name: string;
  label: string;
  shouldDisableDate?: ((day: MaterialUiPickersDate) => boolean) | undefined;
}) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <DatePicker
            fullWidth
            label={label}
            value={input.value}
            onChange={input.onChange}
            variant="inline"
            style={{ marginBottom: "1rem" }}
            autoOk
            shouldDisableDate={shouldDisableDate}
          />
        );
      }}
    </Field>
  );
};

export default DateInput;
