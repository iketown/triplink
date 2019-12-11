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
  Typography,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classes from "*.module.css";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";

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
      <Table className={classes.table} size="small">
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
              <Collapse
                in={expanded}
                component="tr"
                style={{ display: "block" }}
              >
                <Typography>collapsed stuff</Typography>
              </Collapse>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Los Angeles</TableCell>
            <TableCell>Nashville</TableCell>
            <TableCell>
              hey
              <Button onClick={() => setExpanded(old => !old)}>tog</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>stuff</TableCell>
            <TableCell>more</TableCell>
            <TableCell>things</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Button size="small" onClick={() => console.log("hey")}>
                <FaPlaneDeparture style={{ marginRight: "5px" }} />
                add origin
              </Button>
            </TableCell>
            <TableCell>
              <Button size="small" onClick={() => console.log("hey")}>
                <FaPlaneArrival style={{ marginRight: "5px" }} />
                add destination
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default FlightGrid;
