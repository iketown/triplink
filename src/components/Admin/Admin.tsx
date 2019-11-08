import React, { useEffect, useState } from 'react'
import { useFirebaseCtx } from '../Firebase'
import { Container, Grid, Button, Typography, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import useAuth from '../Account/UserCtx'
import ShowMe from '../../utils/ShowMe'
import { StarBorder, Star, RadioButtonUnchecked, RadioButtonChecked } from '@material-ui/icons'

type Account = {
  admins: string[]
  name: string
  id: string
}

const Admin = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const {doSignOut, doUpdateProfile, firestore} = useFirebaseCtx()
  const {user,userProfile} = useAuth()
  const setPrefAcct = (id:string) => {
    doUpdateProfile({currentAccount: id})
  }
  useEffect(()=>{
    // if user doesnt have a pref account, set one.
    if(accounts.length && !accounts.find(acct => acct.id === (userProfile && userProfile.currentAccount))){
      console.log('automatically setting pref account')
      setPrefAcct(accounts[0].id)
    }
  },[accounts,userProfile])

  useEffect(()=>{
    if(user){
      const myAcctsRef = firestore.collection('accounts').where('admins', 'array-contains', user.uid)
      myAcctsRef.get().then(snapshot => {
        const _accounts: Account[] = []
        snapshot.forEach(doc => {
          const {admins, name} = doc.data()
          _accounts.push({admins, id: doc.id, name})
        })
        console.log('_accounts', _accounts)
        setAccounts(_accounts)
      })
    }
    },[user])
  return <Container>
    <Grid container spacing={2}>
  <Grid item xs={6}>
    <Button onClick={doSignOut} variant='outlined' color='secondary'>Sign OUT</Button>
  </Grid>
  <Grid item xs={6}>
    <Typography>Accounts</Typography>
    <List>
      {accounts.map(account => {
        const isPref = !!userProfile && account.id === userProfile.currentAccount
        return (
      <ListItem key={account.id} button onClick={()=>setPrefAcct(account.id)}>
        <ListItemAvatar>
          {isPref ?  <RadioButtonChecked/> :  <RadioButtonUnchecked />}
        </ListItemAvatar>
        <ListItemText primary={account.name} />
      </ListItem>
        )
      })}
    </List>
    <ShowMe obj={accounts} name='accounts' />
    <ShowMe obj={userProfile} name='userProfile' />
  </Grid>
    </Grid>
  </Container>
}

export default Admin
