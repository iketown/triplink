import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Collapse,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classes from "*.module.css";

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  }
});

const FlightGrid = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>from:</TableCell>
            <TableCell>to:</TableCell>
            <TableCell>travelers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Los Angeles</TableCell>
            <TableCell>Nashville</TableCell>
            <TableCell>
              hey
              <Button onClick={() => setExpanded(old => !old)}>tog</Button>
            </TableCell>
          </TableRow>
          <Collapse in={expanded} component="tr" style={{ display: "block" }}>
            <TableCell>Los Angeles</TableCell>
            <TableCell>Nashville</TableCell>
            <TableCell>hey</TableCell>
          </Collapse>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default FlightGrid;
