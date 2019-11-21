import React from "react";
import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";
//
//
const WhiteWash = styled.div`
  background: #ffffffad;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;
const LoadingWhiteOut = () => {
  return (
    <WhiteWash>
      <CircularProgress />
    </WhiteWash>
  );
};

export default LoadingWhiteOut;
