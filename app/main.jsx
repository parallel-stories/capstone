'use strict'
import React from 'react'
import {Router} from 'react-router'
import { Provider } from 'react-redux'
import store from './store'
import {render} from 'react-dom'
import history from './history'
import Routes from './routes'

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
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme(appTheme)}>
      <Router history={history}>
        <Routes />
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('main')
)
