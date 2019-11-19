import React from "react";
import { Container, Typography, Grid } from "@material-ui/core";

const Landing = () => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} justify="center">
          <Typography variant="h2">TRIPSYNC</Typography>
          <Typography variant="subtitle2">Coming Soon</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            <b>SYNC</b> travel plans between group members.
            <br /> Perfect for touring bands, groups headed to out-of-town
            conferences, weddings, or any time multiple people need to
            coordinate travel plans.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">Currently in development</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Landing;
