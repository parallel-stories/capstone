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
      <div className="">
        {
          !_.isEmpty(allStoryBranches) &&
          Object.keys(allStoryBranches).map((key) => <SingleStory key={key} storyBranchTitle={key} storyBranchDetails={allStoryBranches[key]} />)
        }
      </div>
    )
  }
}

export default AllStoryBranches
