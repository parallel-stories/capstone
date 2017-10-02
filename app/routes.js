import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

// authentication
import NotFound from './components/NotFound'

import Navbar from './Navbar'
import Footer from './Footer'

import LandingPage from './components/LandingPage'
import WriteSpace from './components/WriteSpace'
import AllStoryBranches from './components/AllStoryBranches'
import SingleCommunity from './components/SingleCommunity'
import UserProfile from './components/UserProfile'

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
<<<<<<< HEAD
            <Route exact path="/read" component={AllStories} />
            <Route path="/read/story_community/:communityid" component={SingleCommunity} />
=======
            <Route exact path="/read" component={AllStoryBranches} />
            <Route path="/read/:id" component={SingleCommunity} />
>>>>>>> master
            <Route path="/userProfile" component={UserProfile} />
            <Route path='*' component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Routes
