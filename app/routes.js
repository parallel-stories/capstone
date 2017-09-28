import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

// authentication
import NotFound from './components/NotFound'

import LandingPage from './components/LandingPage'
import WriteSpace from './components/WriteSpace'
import AllStories from './components/AllStories'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/home" component={LandingPage} />
        <Route path="/write" component={WriteSpace} />
        <Route path="/read" component={AllStories} />
        <Route path='*' component={NotFound} />
      </Switch>
    )
  }
}

export default Routes
