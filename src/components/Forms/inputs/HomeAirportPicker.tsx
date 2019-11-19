import React from "react";
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormLabel,
  ListItemText
} from "@material-ui/core";
import { Airport } from "../../../apis/amadeus.types";
import { FieldArray } from "react-final-form-arrays";
import { Field } from "react-final-form";

interface IHomeAirportPicker {
  airports: Airport[];
}

const HomeAirportPicker = () => {
  return (
    <FieldArray name="airports">
      {({ fields }) => {
        console.log("fields", fields);
        //@ts-ignore
        return (
          <FormGroup>
            {fields.length ? <FormLabel>Home Airport:</FormLabel> : null}
            {fields.map((fieldName, index) => {
              return (
                <Field name={fieldName}>
                  {({ input, meta }) => {
                    const handleCheck = (e: any, checked: boolean) => {
                      input.onChange({ ...input.value, preferred: checked });
                    };
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={input.value.preferred}
                            onChange={handleCheck}
                          />
                        }
                        label={
                          <ListItemText
                            style={{ margin: "0" }}
                            primary={`${input.value.iataCode} - ${input.value.city}`}
                            secondary={`${input.value.distance.value} ${input.value.distance.unit} from home`}
                          />
                        }
                      />
                    );
                  }}
                </Field>
              );
            })}
          </FormGroup>
        );
      }}
    </FieldArray>
  );
};

export default HomeAirportPicker;
