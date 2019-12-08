import React from "react";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import { Grid, Divider, Typography } from "@material-ui/core";
import styled from "styled-components";
import ShowMe from "../../utils/ShowMe";
import moment from "moment-timezone";
import { getOffsetTimes } from "./appointmentHelpers";
import { Star, StarOutlined, StarBorder } from "@material-ui/icons";

//
//
const ApptContentStyled = styled.div`
  color: white;
  padding: 5px;
`;

const CustomApptContent = ({ data }: Appointments.AppointmentContentProps) => {
  const { offsetEnd, offsetStart } = getOffsetTimes(data);
  const offsets: boolean = !!offsetEnd || !!offsetStart;
  return (
    <ApptContentStyled>
      <Grid container>
        <Grid item xs={12}>
          <span style={{ marginRight: "3px" }}>
            <StarBorder style={{ fontSize: "15px" }} />
          </span>
          <Typography
            component="span"
            style={{ fontSize: "14px" }}
            variant="subtitle1"
          >
            <b>{data.title}</b>
          </Typography>
          <br />
          <Typography variant="caption">{data.startLoc.shortName}</Typography>
        </Grid>

        {!data.allDay && offsets && (
          <>
            <Grid item xs={12}>
              {moment(offsetStart).format("h:mm")} -{" "}
              {moment(offsetEnd).format("h:mm a")}
              <br />
              {data.startLoc && data.startLoc.timeZoneId}
            </Grid>
            <hr style={{ borderColor: "white", width: "100%" }} />
          </>
        )}
        {!data.allDay && (
          <Grid item xs={12}>
            {moment(data.startDate).format("h:mm")} -{" "}
            {moment(data.endDate).format("h:mm a")}
            {offsets && " local"}
          </Grid>
        )}
      </Grid>
      {/* <ShowMe obj={data} name="data" /> */}
    </ApptContentStyled>
  );
};

export default CustomApptContent;
