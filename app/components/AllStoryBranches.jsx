import React, { Component } from 'react'
import SingleStoryBoxDisplay from './SingleStoryBoxDisplay'
import firebase from 'app/fire'
import 'firebase/database'
import _ from 'lodash'
import {Link} from 'react-router-dom'

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

    console.log(this.props.searchResults)

    return (
      <div className="container all-story-branches">
        {
          /* if this is called from the searchbar component -- searhing is true --
            use the first rendering code
            otherwise, use the second
          */
        }
        {
          searching?
          !_.isEmpty(searchResults) &&
          Object.keys(searchResults).map((key) =>
            <SingleStoryBoxDisplay key={key} storyBranchTitle={key} storyBranchDetails={searchResults[key]} />
          )
          :
          !_.isEmpty(allStoryBranches) &&
          Object.keys(allStoryBranches).map((key) =>
            <SingleStoryBoxDisplay key={key} storyBranchTitle={key} storyBranchDetails={allStoryBranches[key]} />
          )
        }
      </div>
    )
  }
}

export default AllStoryBranches
