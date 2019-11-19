import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import { useFirebaseCtx } from "../Firebase";
import DialogContainer from "../Dialogs/DialogContainer";
import { DialogCtxProvider } from "../Dialogs/DialogCtx";
import moment from "moment";
//@ts-ignore
import { CloudinaryContext } from "cloudinary-react";

const App = () => {
  const { auth } = useFirebaseCtx();
  useEffect(() => {
    // @ts-ignore
    window.moment = moment;
  }, []);
  return (
    <Router>
      <CloudinaryContext cloudName="iketown">
        <DialogCtxProvider>
          <Navigation />
          <DialogContainer />
        </DialogCtxProvider>
      </CloudinaryContext>
    </Router>
  );
};

export default App;
