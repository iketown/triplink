import React, { memo } from "react";
import { Tour } from "../Tours/types";
import { isEqual } from "lodash";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Grid,
  Checkbox,
  FormControlLabel,
  Chip,
  Avatar
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useGroups, usePeople } from "./usePeople";
import ShowMe from "../../utils/ShowMe";
import { Group, Person } from "./people.types";
import PersonChip from "./PersonChip";
//@ts-ignore
import { addVarsToCloudinaryURL } from "../Images/cloudinary/cloudinary.helpers";
import { useFirebaseCtx } from "../Firebase";
//
//
interface ITourPeople {
  tour: Tour;
}
const TourPeople = ({ tour }: ITourPeople) => {
  const { groups } = useGroups();
  const { allPeople } = usePeople();

  return (
    <>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              People on <b>{tour.name.toUpperCase()}</b> tour:
            </Typography>
          </Grid>
          {groups &&
            groups.map(group => {
              return (
                <Grid key={group.id} item xs={12} sm={6}>
                  <GroupCard group={group} tour={tour} />
                </Grid>
              );
            })}
        </Grid>
        <CardActions>
          <Link to={routes.people}>
            <Typography variant="button">MANAGE PEOPLE</Typography>
          </Link>
        </CardActions>
      </CardContent>
      <ShowMe obj={groups} name="groups" noModal />
      <ShowMe obj={allPeople} name="allPeople" noModal />
    </>
  );
};

export default TourPeople;

const GroupCard = ({ group, tour }: { group: Group; tour: Tour }) => {
  const { doAddPeopleToTour, doChangePersonInTour } = useFirebaseCtx();
  const { allPeople } = usePeople();
  const handleAddAll = () => {
    console.log("adding all");
    if (group.members) {
      doAddPeopleToTour(group.members, tour.id);
    }
  };

  const allMembersIn =
    group &&
    tour &&
    group.members &&
    tour.tourMembers &&
    group.members.every(personId => tour.tourMembers.includes(personId));
  return (
    <>
      <Card>
        <CardHeader
          title={group.name}
          action={
            <Button
              variant={!!allMembersIn ? "outlined" : "contained"}
              color="primary"
              size="small"
              disabled={allMembersIn}
              onClick={handleAddAll}
            >
              ADD ALL
            </Button>
          }
        ></CardHeader>
        <CardContent>
          {group.members &&
            group.members
              .sort((a: string, b: string) => {
                const personA = allPeople.find(person => person.id === a);
                const personB = allPeople.find(person => person.id === b);
                return personA &&
                  personB &&
                  personA.lastName &&
                  personB.lastName &&
                  personA.lastName.toLowerCase() <
                    personB.lastName.toLowerCase()
                  ? -1
                  : 1;
              })
              .map((personId, index) => {
                const selected =
                  tour.tourMembers && tour.tourMembers.includes(personId);

                const toggleInTour = () => {
                  doChangePersonInTour(personId, tour.id, !selected);
                };
                return (
                  <PersonChip
                    key={personId}
                    personId={personId}
                    selected={selected}
                    index={index}
                    handleClick={toggleInTour}
                  />
                );
              })}
        </CardContent>
      </Card>
      <ShowMe obj={group} name="group" />
    </>
  );
};
