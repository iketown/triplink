import React, { useState } from 'react'
import {FormControl, InputLabel, Select, MenuItem, ListItemText} from '@material-ui/core'
import {Field} from 'react-final-form'
//
//
export const SelectInput = ({name, label}:{name:string, label:string}) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {setOpen(true)}
  const handleClose = () => {setOpen(false)}
  return (
    <Field name={name}>
      {({input, meta})=>{
        const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
          input.onChange(event.target.value as number);
        }
        return (
    <FormControl fullWidth >
        <InputLabel id="demo-controlled-open-select-label">{label}</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={input.value}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem  value={1}><ListItemText primary='hey now' secondary='hows it goin'  /></MenuItem>
          <MenuItem value={2}>group 2</MenuItem>
          <MenuItem value={3}>group 3</MenuItem>
        </Select>
      </FormControl>
              )
            }}
      </Field>
  )
}


export default SelectInput