import React from 'react'
import { Field, FieldInputProps } from 'react-final-form'
import { TextField } from '@material-ui/core'
import { OutlinedTextFieldProps } from '@material-ui/core/TextField'

interface TextInputProps {
  name: string
  label: string
  placeholder?: string
  type?: string
}
const TextInput = (props: TextInputProps) => {
  return (
    <Field name={props.name}>
      {({ input, meta }) => {
        return (
          <TextField
            fullWidth
            variant="outlined"
            value={input.value}
            onChange={e => input.onChange(e.target.value)}
            {...props}
          />
        )
      }}
    </Field>
  )
}

export default TextInput
