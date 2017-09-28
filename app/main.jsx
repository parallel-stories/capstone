'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'

// components
import Navbar from './components/Navbar'

// authentication
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'

// imports from Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { cyan900, brown300, darkWhite, darkBlack, cyan500 } from 'material-ui/styles/colors';
import typography from 'material-ui/styles/typography';

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
});

render(
  <MuiThemeProvider muiTheme={getMuiTheme(appTheme)}>
    <Router history={browserHistory}>
      <Route path="/" component={Navbar} />
      <Route path='*' component={NotFound} />
    </Router>
  </MuiThemeProvider>,
  document.getElementById('main')
)
