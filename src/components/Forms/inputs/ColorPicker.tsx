import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { Field } from "react-final-form";
import { colors, rawColors } from "../../../utils/colors";
import styled from "styled-components";

//
//
interface ColorBoxProps {
  background: string;
  border: string;
}
const ColorBox = styled.div<ColorBoxProps>`
  height: 1rem;
  width: 1rem;
  background: ${p => p.background};
  border: 1px solid ${p => p.border};
`;

const ColorPicker = ({
  name,
  label,
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
      {label && <InputLabel id="demo-simple-select-label">{label}</InputLabel>}
      <Select
        IconComponent={() => null}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        onChange={onChange}
      >
        {rawColors.map((color, index) => {
          return (
            <MenuItem key={color[100]} value={index}>
              <ColorBox background={color[200]} border={color[900]} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default ColorPicker;
