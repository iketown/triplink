import { auth } from 'firebase/app'
import firebase from 'firebase'
import { FirebaseDatabase } from '@firebase/database-types'
import 'firebase/auth'
import { firebaseConfigDEV, firebaseConfig } from './config'
import moment, { Moment } from 'moment'
import { LocationType } from '../Events/EventDialog'
import { TourEvent } from '../Events/useEvents'

const config =
  process.env.NODE_ENV === 'production' ? firebaseConfig : firebaseConfigDEV

class Firebase {
  firestore: firebase.firestore.Firestore
  auth: auth.Auth
  db: firebase.database.Database
  account: string
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
    this.auth = firebase.auth()
    this.db = firebase.database()
    this.firestore = firebase.firestore()
    this.account = ''
  }
  // util fxns //
  private getUserProfile = () => {
    const uid = this.auth.currentUser && this.auth.currentUser.uid
    return this.firestore
      .doc(`/userProfiles/${uid}`)
      .get()
      .then(doc => doc.data())
  }

  //
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
  doUpdateProfile = (updateObj: any) => {
    const uid = this.auth.currentUser && this.auth.currentUser.uid
    if (!uid) return null
    const profileRef = this.firestore.doc(`userProfiles/${uid}`)
    return profileRef.update(updateObj)
  }
  // LOCATIONS //
  doCreateLocation = async (loc: any) => {
    console.log('creating LOC', loc)
    const myProfile = await this.getUserProfile()
    if (!myProfile) {
      console.log('missing profile')
      return null
    }
    const locRef = this.firestore.collection(
      `accounts/${myProfile.currentAccount}/locations`
    )
    const previousLocs = await locRef
      .where('lat', '==', loc.lat)
      .where('lng', '==', loc.lng)
      .get()
      .then(snapshot => {
        if (snapshot.empty) return false
        const _foundLocs: LocationType[] = []
        snapshot.forEach(doc => {
          //@ts-ignore
          _foundLocs.push({ ...doc.data(), id: doc.id })
        })
        return _foundLocs
      })
    if (previousLocs) {
      return previousLocs[0]
    } else {
      return locRef
        .add(loc)
        .then(doc => doc.get())
        .then((doc): LocationType | undefined => {
          if (!!doc.data()) {
            //@ts-ignore
            const { lat, lng, address, placeId, ...rest } = doc.data()
            const id = doc.id
            return { lat, lng, address, placeId, id, ...rest }
          }
        })
    }
  }

  // EVENTS //
  doCreateEvent = async (event: TourEvent) => {
    const myProfile = await this.getUserProfile()
    if (!myProfile) return null
    const eventRef = this.firestore.collection(
      `accounts/${myProfile.currentAccount}/events`
    )
    return eventRef.add({
      ...event,
      startDate: moment(event.startDate).toISOString()
    })
  }
  doEditEvent = async (event: TourEvent) => {
    const myProfile = await this.getUserProfile()
    if (!myProfile) return null
    const eventRef = this.firestore
      .collection(`accounts/${myProfile.currentAccount}/events`)
      .doc(event.id)
    return eventRef.update({
      ...event,
      startDate: moment(event.startDate).toISOString()
    })
  }

  // TOURS //
  doCreateTour = async (name: string, startDate: Moment, endDate: Moment) => {
    if (!this.auth.currentUser) {
      console.log('NO USER!')
      return null
    }
    const myProfile = await this.getUserProfile()
    if (!myProfile) return null
    const uid = this.auth.currentUser.uid
    const toursRef = this.firestore.collection(
      `accounts/${myProfile.currentAccount}/tours`
    )
    const response = await toursRef.add({
      name,
      createdBy: uid,
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
