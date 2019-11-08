import React, { useEffect, useState } from 'react'
import {
  withRouter,
  RouteComponentProps,
  Route,
  Switch
} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from '@material-ui/core/styles'

import * as ROUTES from '../../constants/routes'
import { useFirebaseCtx } from '../Firebase'
import useAuth from '../Account/UserCtx'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    },
    toolbar: theme.mixins.toolbar,
    navTop: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    }
  })
)

interface ResponsiveDrawerProps extends RouteComponentProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container?: Element
}

function ResponsiveDrawer(props: ResponsiveDrawerProps) {
  const { container } = props
  const classes = useStyles()
  const theme = useTheme()
  const {user} = useAuth()
  const [routes, setRoutes] = useState(ROUTES.signedOutRoutes)

  useEffect(() => {
    if (user) {
      setRoutes(ROUTES.signedInRoutes)
    } else {
      setRoutes(ROUTES.signedOutRoutes)
    }
  }, [user])
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { pathname } = props.location
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const handleRoute = (name: string) => {
    props.history.push(name)
    setMobileOpen(false)
  }
  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <div className={classes.navTop}>Center me</div>
      </div>
      <Divider />
      <List>
        {routes.map(({ name, route, Icon }, index) => (
          <ListItem
            selected={pathname === route}
            onClick={() => handleRoute(route)}
            button
            key={name}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
      {user && (
        <>
          <Divider />
          <List>
            {ROUTES.appRoutes.map(({ name, route, Icon }, index) => (
              <ListItem
                selected={pathname === route}
                onClick={() => handleRoute(route)}
                button
                key={name}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </div>
  )

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            TRIPSYNC
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          {[
            ...ROUTES.signedOutRoutes,
            ...ROUTES.signedInRoutes,
            ...ROUTES.appRoutes
          ].map(({ route, component, exact }) => {
            return <Route exact={exact} component={component} path={route} />
          })}
        </Switch>
      </main>
    </div>
  )
}

export default withRouter(ResponsiveDrawer)
