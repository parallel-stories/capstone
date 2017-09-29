'use strict'
// bootstrap and our stylesheet
import './stylesheets/style.scss'
// our material ui style
import MatUIStyle from './stylesheets/MatUIStyle'

import React from 'react'
import {Router} from 'react-router'
import { Provider } from 'react-redux'
import store from './store'
import {render} from 'react-dom'
import history from './history'
import Routes from './routes'

render(
  <MatUIStyle>
    <Provider store={store}>
      <Router history={history}>
        <Routes />
      </Router>
    </Provider>
  </MatUIStyle>,
  document.getElementById('main')
)
