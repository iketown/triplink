import React, { useEffect, useState } from 'react'
import { useFirebaseCtx } from '../Firebase'
import { User } from 'firebase'

const useAuth = (): User => {
  const { auth } = useFirebaseCtx()
  const [user, setUser] = useState()
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(_user => {
      if (_user) {
        setUser(_user)
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [auth])
  return user
}

export default useAuth
