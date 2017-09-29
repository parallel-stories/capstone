import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

// authentication
import NotFound from './components/NotFound'

import Navbar from './Navbar'
import Footer from './Footer'

import LandingPage from './components/LandingPage'
import WriteSpace from './components/WriteSpace'
import AllStories from './components/AllStories'
import SingleCommunity from './components/SingleCommunity'

class Routes extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="pageContent">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={LandingPage} />
            <Route path="/write" component={WriteSpace} />
            <Route exact path="/read" component={AllStories} />
            <Route path="/read/:id" component={SingleCommunity} />
            <Route path='*' component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Routes
