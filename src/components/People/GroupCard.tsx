import React, { useState, Fragment } from "react";
import { Group, Person } from "./people.types";
import {
  Card,
  CardActions,
  Button,
  CardHeader,
  Collapse,
  CardContent,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  InputAdornment,
  Typography,
  Link,
  IconButton
} from "@material-ui/core";
import { CheckboxProps } from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core";
import { Save, CancelOutlined } from "@material-ui/icons";
import { usePeople, useGroup, useGroups } from "./usePeople";
import { useFirebaseCtx } from "../Firebase/firebase.context";
import ShowMe from "../../utils/ShowMe";
import RotatingArrowButton from "../Cards/RotatingArrowButton";
import ColorPicker from "../Forms/inputs/ColorPicker";
import { colorByIndex } from "../../utils/colors";
//
//
const GroupCard = ({
  cancel,
  group
}: {
  cancel?: () => void;
  group?: Group;
}) => {
  const { allPeople } = usePeople();
  const [expanded, setExpanded] = useState(false);
  const [editingName, setEditingName] = useState(!group);

  const [groupName, setGroupName] = useState(group && group.name);
  const { doUpdateGroup, doCreateGroup } = useFirebaseCtx();

  const handleSaveName = async () => {
    if (group && group.id) {
      doUpdateGroup({ groupId: group.id, updateObj: { name: groupName } });
    } else {
      if (groupName && !!groupName.length) {
        await doCreateGroup(groupName);
        cancel && cancel();
      }
    }
    setEditingName(false);
  };
  const handleChangeColor = (e: any) => {
    if (group && group.id) {
      doUpdateGroup({
        groupId: group.id,
        updateObj: { colorIndex: e.target.value }
      });
    }
  };
  const handleCancel = () => {
    setGroupName(group && group.name);
    setEditingName(false);
  };
  return (
    <Card
      style={{
        border: `1px solid ${colorByIndex((group && group.colorIndex) || 0)}`
      }}
    >
      <CardHeader
        title={
          editingName ? (
            <TextField
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              label="group name"
              placeholder="Band, Crew, Driver, etc"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleCancel}>
                      <CancelOutlined />
                    </IconButton>
                    <IconButton size="small" onClick={handleSaveName}>
                      <Save />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          ) : (
            <div>
              <Typography
                variant="subtitle1"
                component="span"
                style={{ marginRight: "1rem" }}
              >
                {groupName}
              </Typography>
              <span>
                <Link variant="caption" onClick={() => setEditingName(true)}>
                  change name
                </Link>
              </span>
            </div>
          )
        }
        action={
          <>
            <ColorPicker
              onChange={handleChangeColor}
              value={(group && group.colorIndex) || 0}
            />
            <RotatingArrowButton
              expanded={expanded}
              onClick={() => setExpanded(old => !old)}
              direction="ccw"
            />
          </>
        }
      />
      <Collapse in={expanded}>
        <CardContent>
          {group && group.id && <GroupPeople groupId={group.id} />}
        </CardContent>
        <CardActions>
          {cancel && <Button onClick={cancel}>Cancel</Button>}
        </CardActions>
      </Collapse>
    </Card>
  );
};

export default GroupCard;

const GroupPeople = ({ groupId }: { groupId: string }) => {
  const { allPeople } = usePeople();
  const { group } = useGroup(groupId);

  return (
    <Fragment>
      {allPeople.map(person => {
        return (
          <GroupPersonCheckBox
            key={person.id}
            person={person}
            groupId={groupId}
          />
        );
      })}
    </Fragment>
  );
};

const GroupPersonCheckBox = ({
  person,
  groupId
}: {
  person: Person;
  groupId?: string;
}) => {
  const { group } = useGroup(groupId);
  const { doChangePersonInGroup } = useFirebaseCtx();
  if (!group) return null;
  const groupIncludesPerson =
    group.members && group.members.includes(person.id);
  const handleCheck = (e: any, ch: boolean) => {
    if (!groupId) return null;
    doChangePersonInGroup(person.id, groupId, ch);
  };
  return (
    <FormControl>
      <FormControlLabel
        label={person.displayName}
        control={
          <Checkbox checked={groupIncludesPerson} onChange={handleCheck} />
        }
      ></FormControlLabel>
    </FormControl>
  );
};

interface ColoredCheckboxProps extends CheckboxProps {
  color: any;
}
