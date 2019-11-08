import React from 'react'
import ShowMe from '../../utils/ShowMe'
import { EventValues } from '../Dialogs/DialogCtx'
import { Form, Field } from 'react-final-form'
import { Grid, Button } from '@material-ui/core'
import GoogPlacesAC from '../Forms/googleAC/GoogPlacesAutocomplete'
import DateInput from '../Forms/inputs/DateInput'
import MapOneLoc from '../Maps/MapOneLoc'
import { getShortNameFromLoc } from '../../utils/locationFxns'
import TextInput from '../Forms/inputs/TextInput'
import { useFirebaseCtx } from '../Firebase'

export type LocationType = {
  placeId: string
  lat: number
  lng: number
  address: string
  venueName?: string
  city?: string
  town?: string
  state?: string
  stateShort?: string
  country?: string
  countryShort?: string
  id?: string
}

export type LocBasicType = {
  placeId: string
  venueName?: string
  locShortName?: string
  lat: number
  lng: number
  address: string
  id: string
}

// export interface EventInterface {
//   startDate: string
//   locBasic: LocBasicType | {}
//   tourId: string
//   startTime?: string
// }

export const EventDialog = ({
  initialValues,
  handleClose
}: {
  initialValues: EventValues
  handleClose: () => void
}) => {
  const { doCreateLocation, doCreateEvent, doEditEvent } = useFirebaseCtx()

  const handleSubmit = async (values: any) => {
    console.log('values', values)
    // save location
    const locResponse = await doCreateLocation({
      ...values.location,
      venueName: values.venueName,
      locShortName: values.locShortName
    }).catch(err => console.log('error submitting LOCATION', err))
    if (!locResponse) return { error: 'some kind of error' }
    const { id, lat, lng, venueName, address } = locResponse
    const locBasic = {
      id,
      lat,
      lng,
      venueName,
      address,
      locShortName: values.locShortName,
      placeId: values.location.placeId
    }
    // save event with minimal location info and locId
    const { startDate, tourId } = values
    if (values.id) {
      //@ts-ignore
      await doEditEvent({ startDate, locBasic, tourId, id: values.id })
    } else {
      //@ts-ignore
      await doCreateEvent({ startDate, locBasic, tourId })
    }
    handleClose()
  }

  return (
    <Form onSubmit={handleSubmit} initialValues={initialValues}>
      {({ handleSubmit, values, form, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid container spacing={2} item xs={12} sm={6}>
                <Grid item xs={12}>
                  <Field name="location">
                    {({ input }) => {
                      const handleChange = (loc: LocationType) => {
                        const shortName = getShortNameFromLoc(loc)
                        form.change('locShortName', shortName)
                        form.change('venueName', loc.address.split(',')[0])
                        input.onChange(loc)
                      }
                      return (
                        <div style={{ marginBottom: '10px' }}>
                          <GoogPlacesAC setLocation={handleChange} />
                        </div>
                      )
                    }}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput label="Venue Name" name="venueName" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput label="Event Name (short)" name="locShortName" />
                </Grid>
                <Grid item xs={8}>
                  <DateInput name="startDate" label="Date" />
                </Grid>
                <Grid item xs={4}>
                  time input
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                {
                  // @ts-ignore
                  <MapOneLoc
                    // @ts-ignore
                    location={values.location}
                  />
                }
              </Grid>
              <Grid item xs={12}>
                <Button disabled={submitting} type="submit">
                  SAVE
                </Button>
              </Grid>
            </Grid>
            <ShowMe obj={values} name="values" noModal />
            <ShowMe obj={initialValues} name="initialValues" noModal />
          </form>
        )
      }}
    </Form>
  )
}

export default EventDialog
