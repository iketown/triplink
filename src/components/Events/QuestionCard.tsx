import React from "react";
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton
} from "@material-ui/core";
import { KeyboardArrowRight, Check } from "@material-ui/icons";
//
//
interface IQuestionCard {
  stepNumber: number;
  title: string;
  description: string;
  finished?: boolean;
  onClick?: () => void;
}
const QuestionCard = ({
  stepNumber,
  title,
  description,
  finished,
  onClick
}: IQuestionCard) => {
  return (
    <Card
      onClick={onClick ? onClick : () => null}
      style={{
        width: "100%",
        transition: "opacity .4s"
      }}
    >
      <CardContent style={{ padding: "16px" }}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            {finished ? (
              <Check style={{ color: "green", fontSize: "3rem" }} />
            ) : (
              <Typography variant="h3">{stepNumber}.</Typography>
            )}
          </Grid>
          <Grid item xs={8}>
            <Typography variant="subtitle1">
              <b>{title}</b>
            </Typography>
            <Typography variant="body2">{description}</Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton>
              <KeyboardArrowRight />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
