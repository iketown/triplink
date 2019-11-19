import React, { useState, memo } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  Collapse,
  FormControl,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip
} from "@material-ui/core";
import { Edit, Group } from "@material-ui/icons";
import RotatingArrowButton from "../Cards/RotatingArrowButton";
import PersonForm from "./PersonForm";
import { Person } from "./people.types";
//@ts-ignore
import { Image, Transformation } from "cloudinary-react";
import CloudAvatar from "../Images/cloudinary/CloudAvatar";
import ShowMe from "../../utils/ShowMe";
import { useGroups } from "./usePeople";
import { useFirebaseCtx } from "../Firebase";
//
//
const PersonCard = ({ person }: { person: Person }) => {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const {
    avatarPublicId,
    avatarURL,
    firstName,
    lastName,
    displayName
  } = person;
  const cardInfo = () => (
    <>
      <CardHeader
        avatar={<CloudAvatar width={30} publicId={avatarPublicId} />}
        action={
          <>
            <Tooltip placement="top" title="Edit Person info">
              <IconButton size="small" onClick={() => setEditing(true)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip placement="top" title="Edit GROUPS">
              <IconButton size="small" onClick={() => setExpanded(old => !old)}>
                <Group />
              </IconButton>
            </Tooltip>
          </>
        }
        title={`${firstName} ${lastName}`}
        subheader={displayName}
      />
      <Collapse in={expanded}>
        <CardContent>
          <GroupCheckBoxes personId={person.id} />
        </CardContent>
      </Collapse>
    </>
  );
  return (
    <Card>
      {editing ? (
        <PersonForm setEditing={setEditing} person={person} />
      ) : (
        cardInfo()
      )}
    </Card>
  );
};

export default PersonCard;

const GroupCheckBoxes = ({ personId }: { personId: string }) => {
  const { groups } = useGroups();
  const { doChangePersonInGroup } = useFirebaseCtx();
  if (!groups) return null;
  return (
    <div>
      {groups.map((group, index) => {
        const groupIncludesPerson =
          group.members && group.members.includes(personId);
        const handleCheck = (e: any, checked: boolean) => {
          if (group.id) doChangePersonInGroup(personId, group.id, checked);
        };
        return (
          <FormControl key={`${group && group.id}${index}`}>
            <FormControlLabel
              label={group.name}
              control={
                //@ts-ignore
                <Checkbox
                  checked={groupIncludesPerson}
                  onChange={handleCheck}
                  style={{ color: "blue" }}
                />
              }
            ></FormControlLabel>
          </FormControl>
        );
      })}
    </div>
  );
};
