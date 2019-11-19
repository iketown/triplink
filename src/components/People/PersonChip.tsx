import React, { memo } from "react";
import { isEqual } from "lodash";
import { usePeople } from "./usePeople";
import { addVarsToCloudinaryURL } from "../Images/cloudinary/cloudinary.helpers";
import { Chip, Avatar, CircularProgress } from "@material-ui/core";
import { Person } from "@material-ui/icons";
//
//
const chipPropsEqual = (prevProps: any, nextProps: any) => {
  return (
    isEqual(prevProps.selected, nextProps.selected) &&
    prevProps.index === nextProps.index
  );
};

const PersonChip = memo(
  ({
    personId,
    selected,
    index,
    handleClick
  }: {
    personId: string;
    selected: boolean;
    index: number;
    handleClick: () => void;
  }) => {
    const { allPeople } = usePeople();
    const person = allPeople.find(person => person.id === personId);

    if (person) {
      return (
        <Chip
          avatar={
            <Avatar
              style={{
                width: "28px",
                height: "28px"
              }}
              src={
                person.avatarURL
                  ? addVarsToCloudinaryURL(
                      person.avatarURL,
                      "c_thumb,g_faces,h_100,w_100"
                    )
                  : ""
              }
            >
              <Person />
            </Avatar>
          }
          variant={selected ? "default" : "outlined"}
          label={person.displayName}
          onClick={handleClick}
          color={selected ? "primary" : "default"}
          style={{ margin: "4px" }}
        />
      );
    }
    return <Chip label={<CircularProgress />} />;
  },
  chipPropsEqual
);

export default PersonChip;
