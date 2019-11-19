import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { Field } from "react-final-form";
import { colors } from "../../../utils/colors";
import styled from "styled-components";

//
//
const ColorBox = styled.div`
  height: '1rem',
  width: '1rem'
  `;
const ColorPicker = ({
  name = "color",
  label = "Color",
  onChange,
  value
}: {
  name?: string | number;
  label?: string;
  value?: string | number;
  onChange?:
    | ((
        event: React.ChangeEvent<{
          name?: string | undefined;
          value: unknown;
        }>,
        child: React.ReactNode
      ) => void)
    | undefined;
}) => {
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={Number(value)}
        onChange={onChange}
      >
        {colors.map((color, index) => {
          return <MenuItem value={index}>Ten</MenuItem>;
        })}
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ColorPicker;
