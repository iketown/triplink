import React from "react";
import styled from "styled-components";
import { IconButton, Tooltip } from "@material-ui/core";
import { IconButtonProps } from "@material-ui/core/IconButton";
import { useFormCtx } from "./FormCtx";
import { eventTypes } from "../eventFormHelpers";
//
//
interface IEventTypeButtonRow {
  value: string;
  onChange: (val: string) => void;
}

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-around;
`;

interface IIconButton extends IconButtonProps {
  selected?: boolean;
}
const StyledIconButton = styled(IconButton)<IIconButton>`
  opacity: ${p => (p.selected ? 1 : 0.5)};
`;
const EventTypeButtonRow = ({ value, onChange }: IEventTypeButtonRow) => {
  const { data } = useFormCtx();
  return (
    <ButtonRow>
      {Object.entries(eventTypes).map(([name, { label, Icon }]) => {
        const selected = name === value;
        return (
          <Tooltip key={name} title={label} placement="top">
            <StyledIconButton {...{ selected }} onClick={() => onChange(name)}>
              <Icon color={selected ? "blue" : "grey"} />
            </StyledIconButton>
          </Tooltip>
        );
      })}
    </ButtonRow>
  );
};

export default EventTypeButtonRow;
