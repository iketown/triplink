import React, { useState } from "react";
import { Typography, Grid, Card, Button } from "@material-ui/core";
import GroupCard from "./GroupCard";
import { useGroups } from "./usePeople";
import ShowMe from "../../utils/ShowMe";
//
//
const GroupList = () => {
  const { groups } = useGroups();
  return (
    <Grid container spacing={2} item xs={12}>
      <Grid item xs={12}>
        <Typography variant={"h5"}>Groups</Typography>
      </Grid>
      {groups &&
        groups.map(group => {
          return (
            <Grid key={group.id} item xs={12} md={6}>
              <GroupCard group={group} />
            </Grid>
          );
        })}
      <NewGroupButton />
      <ShowMe obj={groups} name="groups" />
    </Grid>
  );
};

export default GroupList;

const NewGroupButton = () => {
  const [creatingNew, setCreatingNew] = useState(false);
  return (
    <Grid item xs={12} md={6}>
      {creatingNew ? (
        <GroupCard cancel={() => setCreatingNew(false)} />
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
            onClick={() => setCreatingNew(true)}
          >
            Add New Group
          </Button>
        </div>
      )}
    </Grid>
  );
};
