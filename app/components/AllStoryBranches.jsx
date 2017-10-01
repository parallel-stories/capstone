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
    const {allStoryBranches} = this.state
    return (
      <div className="row">
        <div className="col-sm-4 col-md-4 col-lg-4" >
          {
            !_.isEmpty(allStoryBranches) &&
            Object.keys(allStoryBranches).map((key) => <Link key={key} to={`/read/story_branch/${key}`}><SingleStoryBoxDisplay storyBranchTitle={key} storyBranchDetails={allStoryBranches[key]} /></Link>)
          }
        </div>
      </div>
    )
  }
}

export default AllStoryBranches
