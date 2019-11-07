import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navigation from '../Navigation/Navigation'
import { useFirebaseCtx } from '../Firebase'
import DialogContainer from '../Dialogs/DialogContainer'
import { DialogCtxProvider } from '../Dialogs/DialogCtx'
import moment from 'moment'
const App = () => {
  const { auth } = useFirebaseCtx()
  useEffect(() => {
    // @ts-ignore
    window.moment = moment
  }, [])
  return (
    <Router>
      <DialogCtxProvider>
        <Navigation />
        <DialogContainer />
      </DialogCtxProvider>
    </Router>
  )
}

export default App
