import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Typography
} from "@material-ui/core";
import RotatingArrowButton from "../../Cards/RotatingArrowButton";
import RecentLocList from "./RecentLocList";
import { useFormCtx } from "./FormCtx";
import styled from "styled-components";
//
//
interface IEventCard {
  title: string;
  subheader: string;
  content?: any;
  expanded: boolean;
  setExpanded: (val: any) => void;
  extraContent?: any;
  category: string;
}
const CardContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;
const StyledCard = styled(Card)``;
const CategoryText = styled.div`
  position: absolute;
  top: -14px;
  left: -7px;
  font-size: 10px;
  padding: 2px;
  border-top: 1px solid gainsboro;
  border-left: 1px solid gainsboro;
  background-color: #ffffff44;
`;

const EventCard = ({
  title,
  subheader,
  content,
  expanded,
  setExpanded,
  extraContent,
  category
}: IEventCard) => {
  const { data } = useFormCtx();
  return (
    <CardContainer>
      <CategoryText>
        <Typography
          variant="caption"
          color="textSecondary"
          className="category"
        >
          {category.toUpperCase()}
        </Typography>
      </CategoryText>
      <StyledCard>
        <CardHeader
          style={{ cursor: "pointer" }}
          onClick={() => setExpanded((old: boolean) => !old)}
          {...{ title, subheader }}
          titleTypographyProps={{ style: { fontSize: "19px" } }}
          action={<RotatingArrowButton expanded={expanded} />}
        ></CardHeader>
        <Collapse in={expanded}>
          <CardContent style={{ paddingTop: 0 }}>{content}</CardContent>
        </Collapse>
        {extraContent}
      </StyledCard>
    </CardContainer>
  );
};

export default EventCard;
