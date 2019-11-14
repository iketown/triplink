import React from 'react'
import { DateTimePicker } from '@material-ui/pickers'
import { Field } from 'react-final-form'
import moment from 'moment-timezone'
export const DateTimeInput = ({
  name,
  label,
  timeZoneId
}: {
  name: string
  label: string
  timeZoneId?: string
}) => {
  return (
    <Field name={name}>
      {({ input }) => {
        const handleChange = (value: any) => {
          if (timeZoneId) {
            const strippedVal = value.format('YYYY-MM-DD HH:mm')
            const tzTime = moment.tz(strippedVal, timeZoneId).format()
            input.onChange(tzTime)
          } else {
            input.onChange(value)
          }
        }
        const value = timeZoneId
          ? moment(input.value).tz(timeZoneId)
          : input.value
        return (
          <DateTimePicker
            value={value}
            onChange={handleChange}
            {...{ label }}
            helperText={`time zone: ${timeZoneId}`}
          />
        )
      }}
    </Field>
  )
}
