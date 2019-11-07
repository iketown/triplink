import React from 'react'
import ShowMe from '../../utils/ShowMe'
import { EventValues } from '../Dialogs/DialogCtx'
import { Form, Field } from 'react-final-form'
import { Grid, Button } from '@material-ui/core'

export const EventDialog = ({
  initialValues
}: {
  initialValues: EventValues
}) => {
  console.log('initialValues', initialValues)
  const handleSubmit = (values: any) => console.log('values', values)

  return (
    <Form onSubmit={handleSubmit}>
      {({ handleSubmit }) => {
        return (
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                yo
              </Grid>
              <Grid item xs={12} sm={6}>
                yo
              </Grid>
              <Grid item xs={12}>
                <Button type="submit">SAVE</Button>
              </Grid>
            </Grid>
            <ShowMe obj={initialValues} name="initialValues" noModal />
          </form>
        )
      }}
    </Form>
  )
}

export default EventDialog
