'use strict'
import React from 'react'
import {Router} from 'react-router'
import {Route, Switch} from 'react-router-dom'
import {render} from 'react-dom'

// history
import history from './history'

// components
import LandingPage from './components/LandingPage'
import WriteSpace from './components/WriteSpace'

// authentication
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'

// imports from Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import { cyan900, brown300, darkWhite, darkBlack, cyan500 } from 'material-ui/styles/colors'
import typography from 'material-ui/styles/typography'

// app theme for MuiThemeProvider to user
const appTheme = getMuiTheme({
  ...darkBaseTheme,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: cyan900,
    primary2Color: brown300,
    primary3Color: darkWhite,
    textColor: darkBlack,
    pickerHeaderColor: cyan500,
  },
  appBar: {
    titleFontWeight: typography.fontWeightLight
  },
  card: {
    fontWeight: typography.fontWeightLight
  }
})

render(
  <MuiThemeProvider muiTheme={getMuiTheme(appTheme)}>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/home" component={LandingPage} />
        <Route path="/write" component={WriteSpace} />
        <Route path='*' component={NotFound} />
      </Switch>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('main')
)
