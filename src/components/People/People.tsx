import React, { useState } from "react";
import { useFirebaseCtx } from "../Firebase";
import { Person } from "./people.types";
import { usePeople } from "./usePeople";
import ShowMe from "../../utils/ShowMe";
import PersonCard from "./PersonCard";
import PersonForm from "./PersonForm";
import GroupList from "./GroupList";
import { Grid, Typography, Container, Button, Card } from "@material-ui/core";
//
//
const People = () => {
  const { allPeople } = usePeople();
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">People</Typography>
        </Grid>
        {allPeople.map(person => (
          <Grid key={person.id} item xs={12} md={6}>
            <PersonCard person={person} />
          </Grid>
        ))}
        <Grid item xs={12} md={6}>
          <CreateNewPersonButton />
        </Grid>
        <Grid item xs={12}>
          <GroupList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default People;

const CreateNewPersonButton = () => {
  const [formOpen, setFormOpen] = useState(false);
  return formOpen ? (
    <Card>
      <PersonForm setEditing={setFormOpen} />
    </Card>
  ) : (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        height: "100%"
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => setFormOpen(true)}
      >
        Add New Person
      </Button>
    </div>
  );
};
