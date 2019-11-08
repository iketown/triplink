import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import EventDialog from '../Events/EventDialog'
import { useDialogCtx } from './DialogCtx'

export const DialogContainer = () => {
  const { state, dispatch } = useDialogCtx()
  const handleClose = () => {
    dispatch({ type: 'CLOSE_DIALOG' })
  }
  const contents = {
    event: (
      <EventDialog
        initialValues={state.initialValues}
        handleClose={handleClose}
      />
    ),
    travel: () => <div />,
    person: () => <div />
  }
  const titles = {
    event: 'EVENT',
    travel: 'TRAVEL',
    person: 'PERSON'
  }
  if (!state) return null
  const { formType } = state
  return (
    <Dialog maxWidth="md" fullWidth open={state.open} onClose={handleClose}>
      <DialogTitle>{titles[formType]}</DialogTitle>
      <DialogContent>{contents[formType]}</DialogContent>
    </Dialog>
  )
}

export default DialogContainer
