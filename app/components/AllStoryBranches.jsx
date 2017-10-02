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
      this.setState({allStoryBranches: storyBranches})
    })
  }

  render() {
    const { allStoryBranches } = this.state
    const { searchResults, searching } = this.props

    console.log(this.props.searchResults, searching)

    return (
      <div className="container all-story-branches">
        {
          searching?
          !_.isEmpty(searchResults) &&
          Object.keys(searchResults).map((key) =>
            <SingleStory key={key} storyBranchTitle={key} storyBranchDetails={searchResults[key]} />
          )
          :
          !_.isEmpty(allStoryBranches) &&
          Object.keys(allStoryBranches).map((key) =>
            <SingleStory key={key} storyBranchTitle={key} storyBranchDetails={allStoryBranches[key]} />
          )
        }
      </div>
    )
  }
}

export default AllStoryBranches
