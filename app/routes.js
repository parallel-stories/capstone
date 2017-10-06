import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

// authentication
import NotFound from './components/NotFound'

import Navbar from './Navbar'
import Footer from './Footer'
import LandingPage from './components/LandingPage'
import WriteSpace from './components/WriteSpace'
import AllStoryBranches from './components/AllStoryBranches'
import StoryBranchNav from './components/StoryBranchNav'
import UserProfile from './components/UserProfile'
import SingleCard from './components/SingleCard'
import SingleStoryPage from './components/SingleStoryPage'
import Searchbar from './components/Searchbar'

class Routes extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <Navbar />
        <div>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={LandingPage} />
            <Route exact path="/write" component={WriteSpace} />
            <Route exact path="/write/:rootId/:cardId/new_branch" render={(props)=><WriteSpace isBranch={true} {...props} />} />
            <Route exact path="/read" component={Searchbar} />
            <Route exact path="/read/story_branch/:branchId" component={SingleStoryPage} />
            <Route exact path="/read/story_branch/:branchId/:cardId" component={StoryBranchNav} />
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
