import React, { createContext, useContext } from 'react'
import Firebase from './firebase'

const FirebaseCtx = createContext({})

export const FirebaseCtxProvider = ({ children }: { children: any }) => {
  console.log('provider')
  return <FirebaseCtx.Provider value={new Firebase()} children={children} />
}

export const useFirebaseCtx = (): Firebase => {
  const ctx = useContext(FirebaseCtx)
  if (!ctx)
    throw new Error('useFirebaseCtx must be a descendant of Firebase Provider')
  // @ts-ignore
  return ctx
}
export default FirebaseCtx
