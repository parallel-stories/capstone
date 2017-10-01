'use strict'
// bootstrap and our stylesheet
import './stylesheets/style.scss'
// our material ui style
import MatUIStyle from './stylesheets/MatUIStyle'

import React from 'react'
import {Router} from 'react-router'
import {render} from 'react-dom'
import history from './history'
import Routes from './routes'

render(
  <MatUIStyle>
    <Router history={history}>
      <Routes />
    </Router>
  </MatUIStyle>,
  document.getElementById('main')
)
