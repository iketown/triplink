import React from 'react'
import { DatePicker } from '@material-ui/pickers'
import { Field } from 'react-final-form'

//
//

export const DateInput = ({ name, label }: { name: string; label: string }) => {
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
            style={{ marginBottom: '1rem' }}
            autoOk
          />
        )
      }}
    </Field>
  )
}

export default DateInput
