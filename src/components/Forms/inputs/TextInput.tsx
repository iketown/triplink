import React from "react";
import { Field, FieldInputProps } from "react-final-form";
import { TextField } from "@material-ui/core";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";

interface TextInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  extraOnChange?: (value: string) => void;
}
const TextInput = ({ extraOnChange, ...props }: TextInputProps) => {
  return (
    <Field name={props.name}>
      {({ input, meta }) => {
        return (
          <TextField
            error={meta.dirty && !!meta.error}
            helperText={meta.dirty && meta.error}
            fullWidth
            variant="outlined"
            value={input.value}
            onChange={e => {
              input.onChange(e.target.value);
              if (extraOnChange) {
                extraOnChange(e.target.value);
              }
            }}
            {...props}
          />
        );
      }}
    </Field>
  );
};

export default TextInput;
