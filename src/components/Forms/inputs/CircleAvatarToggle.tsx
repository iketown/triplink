import React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Person } from "../../People/people.types";
//@ts-ignore
import { Image, Transformation } from "cloudinary-react";
import { Person as PersonIcon } from "@material-ui/icons";

//
//
export const CircleAvatarToggle = ({
  person,
  onClick,
  isOn
}: {
  person: Person;
  onClick?: () => void;
  isOn?: boolean;
}) => {
  return (
    <Tooltip title={`${isOn ? "REMOVE" : "ADD"} ${person.displayName}`}>
      <IconButton
        size="small"
        style={{ background: "beige", opacity: isOn ? 1 : 0.3 }}
        onClick={onClick}
      >
        {person.avatarPublicId ? (
          <Image publicId={person.avatarPublicId}>
            <Transformation
              width={30}
              height={30}
              fetchFormat="auto"
              crop="thumb"
              gravity="face"
              radius="max"
            />
          </Image>
        ) : (
          <PersonIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default CircleAvatarToggle;
