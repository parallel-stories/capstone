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
import AllUsers from './components/AllUsers'
import UserPage from './components/UserPage'

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
            <Route exact path="/write" render={(props)=><WriteSpace isBranch={false} {...props} />} />
            <Route exact path="/write/:rootId/:cardId/new_branch" render={(props)=><WriteSpace isBranch={true} {...props} />} />
            <Route exact path="/read" component={Searchbar} />
            <Route exact path="/read/:branchId" component={SingleStoryPage} />
            <Route exact path="/read/:branchId/:cardId" component={StoryBranchNav} />
            <Route exact path="/allUsers" component={AllUsers} />
            <Route path="/allUsers/:id" component={UserPage} />
            <Route exact path="/userProfile" component={UserProfile} />
            <Route path='*' component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Routes
