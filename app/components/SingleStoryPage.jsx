import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import firebase from 'app/fire'
import _ from 'lodash'

export default class SingleStoryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStoryBranch: {}
    }
  }

  componentDidMount() {
    const storyBranchId = this.props.match.params.branchId
    firebase.database().ref(`storyBranch/${storyBranchId}`).once('value', snap => {
      const storyBranch = snap.val()
      this.props.handleCurrentStoryChange(storyBranchId, storyBranch)
      //this.setState({currentStoryBranch: storyBranch})
    })
  }

  render() {
    const storyBranchId = this.props.match.params.branchId
    const storyBranch = this.props.currentStoryBranch

    return (
      <div>
        <div>
          <h1>{storyBranchId}</h1>
          <h3>{storyBranch.storyRoot}</h3>
          <img src="http://lorempixel.com/400/200/" alt="Hello" />
        </div>
        <div>
        {
          !_.isEmpty(storyBranch) &&
          <Link to={`/read/story_branch/${storyBranchId}/${storyBranch.storyCards.shift()}`}>Start Reading</Link>
        }
        </div>
      </div>
    )
  }
}
