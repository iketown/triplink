import React, { useState } from "react";
import { useFirebaseCtx } from "../Firebase";
import TextInput from "../Forms/inputs/TextInput";
import DateInput from "../Forms/inputs/DateInput";
import { Form } from "react-final-form";
import {
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography
} from "@material-ui/core";
import moment, { Moment } from "moment";
import { useTours, useToursTimeRange } from "./useTours";
import ShowMe from "../../utils/ShowMe";
import { MaterialUiPickersDate } from "@material-ui/pickers";

interface TourInitialValues {
  startDate: Moment;
  endDate: Moment;
  name: string;
  id?: string;
}
interface TourFormProps {
  initialValues: TourInitialValues;
}
const TourForm = ({ initialValues }: TourFormProps) => {
  //@ts-ignore
  window.moment = moment;
  const { doCreateTour, doUpdateTour } = useFirebaseCtx();
  const { tours } = useTours();
  const [editing, setEditing] = useState(!!initialValues.id);
  const toggleEditing = () => setEditing(old => !old);
  const handleSubmit = async ({
    name,
    startDate,
    endDate
  }: {
    name: string;
    startDate: Moment;
    endDate: Moment;
  }) => {
    if (initialValues.id) {
      // update
      console.log("OK, updating");
      doUpdateTour(initialValues.id, {
        name,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD")
      });
    }
    if (!initialValues.id) {
      const response = await doCreateTour(name, startDate, endDate);
      console.log("response", response);
    }
  };
  const { shouldDisableStartdate } = useToursTimeRange();

  return (
    <Form onSubmit={handleSubmit} initialValues={initialValues}>
      {({ handleSubmit, values }) => {
        return (
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextInput name="name" label="Tour Name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateInput
                    shouldDisableDate={shouldDisableStartdate}
                    name="startDate"
                    label="Start Date (est)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateInput name="endDate" label="End Date (est)" />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: "flex-end" }}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
              <ShowMe obj={tours} name="tours"></ShowMe>
            </CardActions>
          </form>
        );
      }}
    </Form>
  );
};

export default TourForm;

const DateDisplay = ({
  date,
  label = "starts",
  toggleEditing
}: {
  date: Moment;
  label?: string;
  toggleEditing: () => void;
}) => {
  return (
    <div>
      <Typography color="textSecondary" variant="caption">
        {label}
      </Typography>
      <Typography>{date.format("MMM D")}</Typography>
      <Button onClick={toggleEditing}>EDIT</Button>
    </div>
  );
};
