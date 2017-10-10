import React, { Component } from 'react'
import SingleStoryBoxDisplay from './SingleStoryBoxDisplay'
import firebase from 'app/fire'
import _ from 'lodash'
import {Link} from 'react-router-dom'
import {onlyPublished} from '../utils/storyBranchNavUtils'

class AllStoryBranches extends Component {
  constructor() {
    super()
    this.state = {
      allStoryBranches: {}
    }
  }

  componentDidMount() {
    this.listenerRef = firebase.database().ref('storyBranch/')
    this.listenerRef.on('value', snap => {
      const storyBranches = onlyPublished(snap.val())
      this.setState({allStoryBranches: storyBranches})
    })
  }

  componentWillUnmount() {
    this.listenerRef.off()
  }

  render() {
    const { allStoryBranches } = this.state
    const { searchResults, searching } = this.props

    return (
      <div className="container all-box-display">
        {
          /* if this is called from the searchbar component -- searhing is true --
            use the first rendering code
            otherwise, use the second
          */
        }
        {
          searching ?
          !_.isEmpty(searchResults) &&
            Object.keys(searchResults).map((key) =>
              <SingleStoryBoxDisplay key={key} storyBranchTitle={key} storyBranchDetails={searchResults[key]} thisKey={key}/>
            )
          :
          !_.isEmpty(allStoryBranches) &&
            Object.keys(allStoryBranches).map((key) =>
              <SingleStoryBoxDisplay key={key} storyBranchTitle={key} storyBranchDetails={allStoryBranches[key]} thisKey={key}/>
            )
        }
      </div>
    )
  }
}

export default AllStoryBranches
