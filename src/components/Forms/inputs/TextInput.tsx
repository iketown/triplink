import React from "react";
import { Field, FieldInputProps } from "react-final-form";
import { TextField } from "@material-ui/core";
import {
  OutlinedTextFieldProps,
  TextFieldProps
} from "@material-ui/core/TextField";
import { OutlinedInputProps } from "@material-ui/core/OutlinedInput";

interface TextInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  extraOnChange?: (value: string) => void;
  InputProps?: Partial<OutlinedInputProps>;
}
const TextInput = ({ extraOnChange, InputProps, ...props }: TextInputProps) => {
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
            InputProps={InputProps}
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
