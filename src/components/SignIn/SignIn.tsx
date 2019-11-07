import React, { useState } from 'react'
import {
  TextField,
  Grid,
  Container,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions
} from '@material-ui/core'
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import { Form, Field } from 'react-final-form'
import TextInput from '../Forms/inputs/TextInput'
import { useFirebaseCtx } from '../Firebase'
import { routes } from '../../constants/routes'
import { RouteComponentProps } from 'react-router'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    formField: {
      textAlign: 'center'
    },
    header: {
      textAlign: 'center'
    },
    button: {
      padding: '2rem',
      textAlign: 'center'
    }
  })
)

const SignInUp = (props: RouteComponentProps) => {
  const [signingUp, setSigningUp] = useState(false)
  const {
    doCreateUserWithEmailAndPassword,
    doSignInWithEmailAndPassword
  } = useFirebaseCtx()
  const ss = useStyles()
  const theme = useTheme()
  const handleSubmit = async ({
    email,
    password,
    displayName,
    photoURL
  }: {
    email: string
    password: string
    displayName: string
    photoURL: string
  }) => {
    const signInFxn = signingUp
      ? doCreateUserWithEmailAndPassword
      : doSignInWithEmailAndPassword

    return signInFxn(email, password)
      .then(async response => {
        if (signingUp && response.user) {
          await response.user.updateProfile({
            displayName,
            photoURL
          })
        }
        props.history.push(routes.home)
      })
      .catch(err => err.message)
  }
  return (
    <Container className={ss.root}>
      <Form onSubmit={handleSubmit}>
        {({ handleSubmit, errors, submitErrors }) => {
          console.log('submitErrors', submitErrors)
          return (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader
                  title={signingUp ? 'Sign up' : 'Sign In'}
                  action={
                    <Button
                      onClick={() => setSigningUp(old => !old)}
                      color="primary"
                    >
                      {signingUp
                        ? 'been here before?  SIGN IN'
                        : 'first time? SIGN UP'}
                    </Button>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} className={ss.formField}>
                      <TextInput
                        label="Email"
                        name="email"
                        placeholder="me@domain.net"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} className={ss.formField}>
                      <TextInput
                        label="Password"
                        name="password"
                        type="password"
                      />
                    </Grid>
                    {signingUp && <ExtraSignUpFields />}
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" type="submit">
                    Sign In
                  </Button>
                </CardActions>
              </Card>
            </form>
          )
        }}
      </Form>
    </Container>
  )
}

export default SignInUp

const ExtraSignUpFields = () => {
  const ss = useStyles()

  return (
    <>
      <Grid item xs={12} sm={6} className={ss.formField}>
        <TextInput
          label="Password Confirmation"
          name="passwordConfirmation"
          type="password"
        />
      </Grid>
      <Grid item xs={12} sm={6} className={ss.formField}>
        <TextInput label="User Name" name="displayName" />
      </Grid>
      <Grid item xs={12} sm={6} className={ss.formField}>
        <TextInput label="photo url" name="photoURL" />
      </Grid>
    </>
  )
}
