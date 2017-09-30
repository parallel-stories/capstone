import React, { Component } from 'react'
import SingleStory from './SingleStory'
import firebase from 'app/fire'
import 'firebase/database'
import _ from 'lodash'

class AllStoryBranches extends Component {
  constructor() {
    super()
    this.state = {
      allStoryBranches: {}
    }
  }

  componentDidMount() {
    firebase.database().ref().child('storyBranch').on('value', snap => {
      const storyBranches = snap.val()
      console.log(storyBranches)
      this.setState({allStoryBranches: storyBranches})
    })
  }

  render() {
    const {allStoryBranches} = this.state
    return (
      <div className="row">
        <div className="col-sm-4 col-md-4 col-lg-4" >
          {
            !_.isEmpty(allStoryBranches) &&
            Object.keys(allStoryBranches).map((key) => <SingleStory key={key} storyBranchTitle={key} storyBranchDetails={allStoryBranches[key]} />)
          }
        </div>
      </div>
    )
  }
}

export default AllStoryBranches
