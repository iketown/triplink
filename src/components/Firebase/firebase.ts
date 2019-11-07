import { auth } from 'firebase/app'
import firebase from 'firebase'
import { FirebaseDatabase } from '@firebase/database-types'
import 'firebase/auth'
import { firebaseConfigDEV, firebaseConfig } from './config'
import moment, { Moment } from 'moment'

const config =
  process.env.NODE_ENV === 'production' ? firebaseConfig : firebaseConfigDEV

class Firebase {
  firestore: firebase.firestore.Firestore
  auth: auth.Auth
  db: firebase.database.Database
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
    this.auth = firebase.auth()
    this.db = firebase.database()
    this.firestore = firebase.firestore()
  }

  doCreateUserWithEmailAndPassword = (email: string, password: string) => {
    return this.auth.createUserWithEmailAndPassword(email, password)
  }

  doSignInWithEmailAndPassword = (email: string, password: string) => {
    return this.auth.signInWithEmailAndPassword(email, password)
  }
  doSignOut = () => this.auth.signOut()
  doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email)
  doPasswordUpdate = (password: string) => {
    if (this.auth.currentUser) {
      return this.auth.currentUser.updatePassword(password)
    }
  }

  // TOURS //
  doCreateTour = async (name: string, startDate: Moment, endDate: Moment) => {
    if (!this.auth.currentUser) {
      console.log('NO USER!')
      return null
    }
    const uid = this.auth.currentUser.uid
    const toursRef = this.firestore.collection(`tours`)
    const response = await toursRef.add({
      name,
      admin: uid,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    })
    console.log('response', response)
    return response
  }
  doUpdateTour = async (
    name: string,
    startDate: Moment,
    endDate: Moment,
    tourId: string
  ) => {
    if (!this.auth.currentUser) {
      console.log('NO USER!')
      return null
    }
    const tourRef = this.firestore.doc(`tours/${tourId}`)
    const updateObj = {
      name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
    return tourRef.update(updateObj)
  }
}

export default Firebase
