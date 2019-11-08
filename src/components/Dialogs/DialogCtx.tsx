import React, { createContext, useContext, useReducer } from 'react'
import { id } from 'date-fns/esm/locale'

export type EventValues = {
  startDate: string
}
const initialState = {
  open: false,
  formType: 'event',
  initialValues: {
    startDate: '2019-12-01T05:59:59.999Z'
  }
}

// @ts-ignore
const DialogCtx = createContext()

// @ts-ignore
const dialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CLOSE_DIALOG': {
      return { ...state, open: false }
    }
    case 'EDIT_EVENT':
    case 'CREATE_EVENT': {
      const { initialValues } = action
      return { ...state, open: true, initialValues }
    }
    default:
      return state
  }
}

type DialogCtxType = {
  state: {
    open: boolean
    formType: 'event' | 'travel' | 'person'
    initialValues: any
  }
  dispatch: React.Dispatch<any>
}

// @ts-ignore
export const DialogCtxProvider = props => {
  const [state, dispatch] = useReducer(dialogReducer, initialState)
  return <DialogCtx.Provider value={{ state, dispatch }} {...props} />
}

export const useDialogCtx = () => {
  const ctx = useContext<DialogCtxType>(DialogCtx)
  if (!ctx)
    throw new Error('usedialogCtx must be a descendant of DialogCtxProvider 😕')
  const { state, dispatch } = ctx
  return { state, dispatch }
}
