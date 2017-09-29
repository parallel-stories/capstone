import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

// authentication
// import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'

import Navbar from './Navbar'
import Footer from './Footer'

import LandingPage from './components/LandingPage'
import WriteSpace from './components/WriteSpace'
import AllStories from './components/AllStories'

class Routes extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/home" component={LandingPage} />
          <Route path="/write" component={WriteSpace} />
          <Route path="/read" component={AllStories} />
          <Route path='*' component={NotFound} />
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default Routes
