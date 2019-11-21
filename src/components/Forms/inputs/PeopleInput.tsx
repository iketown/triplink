import React from "react";
import { Field } from "react-final-form";
import { useTours } from "../../Tours/useTours";
import {
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import ShowMe from "../../../utils/ShowMe";
import { useGroups, usePeople } from "../../People/usePeople";
import { Person } from "../../People/people.types";

//
//
const PeopleInput = ({
  tourId,
  name = "people"
}: {
  tourId: string;
  name?: string;
}) => {
  const { tours } = useTours();
  const { groups } = useGroups();
  const { allPeople, tourPeople } = usePeople(tourId);

  const tour = tours.find(tour => tour.id === tourId);
  if (!tour) return null;

  return (
    <Field name={name}>
      {({ input, meta }) => {
        const handleGroupClick = (groupId?: string) => {
          if (!groupId) return null;
          const group = groups.find(g => g.id === groupId);
          const groupMembers = (group && group.members) || [];
          const oldPeople = input.value || [];
          const newPeople = Array.from(
            new Set([...oldPeople, ...groupMembers])
          );
          input.onChange(newPeople);
        };
        const handleRemoveGroup = (groupId?: string) => {
          if (!groupId) return null;
          const group = groups.find(g => g.id === groupId);
          const groupMembers = (group && group.members) || [];
          input.onChange(
            input.value.filter((id: string) => !groupMembers.includes(id))
          );
        };
        const handleTogglePerson = (personId: string, checked: boolean) => {
          if (checked) {
            input.onChange([...input.value, personId]);
          } else {
            input.onChange(
              input.value.filter((pid: string) => pid !== personId)
            );
          }
        };
        return (
          <>
            <CardContent>
              {tourPeople.map((person: Person) => {
                if (!person) return null;
                return (
                  <PersonCheckBox
                    key={person.id}
                    person={person}
                    onChange={handleTogglePerson}
                    checked={input.value.includes(person.id)}
                  />
                );
              })}
            </CardContent>
            <CardActions style={{ overflow: "scroll" }}>
              {groups.map(group => {
                const allIn =
                  group.members &&
                  group.members.length &&
                  group.members.every(
                    id =>
                      input.value.includes(id) || !tour.tourMembers.includes(id)
                  );
                return (
                  <Button
                    key={group.id}
                    style={{ border: "1px solid blue" }}
                    color="primary"
                    variant={allIn ? "contained" : "outlined"}
                    onClick={
                      allIn
                        ? () => handleRemoveGroup(group.id)
                        : () => handleGroupClick(group.id)
                    }
                  >
                    {group.name}
                  </Button>
                );
              })}
            </CardActions>
          </>
        );
      }}
    </Field>
  );
};

export default PeopleInput;

interface IPersonCheckBox {
  person: Person;
  checked: boolean;
  onChange: (personId: string, selected: boolean) => void;
}
const PersonCheckBox = ({ person, checked, onChange }: IPersonCheckBox) => {
  const handleChange = (e: any, selected: boolean) => {
    onChange(person.id, selected);
  };
  return (
    <FormControlLabel
      style={{ paddingRight: "1rem" }}
      control={
        <Checkbox
          style={{ padding: "4px" }}
          checked={checked}
          onChange={handleChange}
          color="primary"
        />
      }
      label={person.displayName}
    />
  );
};
