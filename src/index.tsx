import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App/App'
import * as serviceWorker from './serviceWorker'
import { FirebaseCtxProvider } from './components/Firebase'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

ReactDOM.render(
  <FirebaseCtxProvider>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <App />
    </MuiPickersUtilsProvider>
  </FirebaseCtxProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
