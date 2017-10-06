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
      this.setState({currentStoryBranch: snap.val()})
    })
  }

  render() {
    const storyBranchId = this.props.match.params.branchId
    const storyBranch = this.state.currentStoryBranch

    return (
      <div>
        <div>
          <h2 className="align-center">{storyBranchId}</h2>
          <h4 className="align-center">Root: {storyBranch.storyRoot}</h4>
          <img className="story-branch" src="http://lorempixel.com/400/200/" alt="Hello" />
        </div>
        <div className="start-read">
        {
          !_.isEmpty(storyBranch) &&
          <Link to={`/read/story_branch/${storyBranchId}/${storyBranch.storyCards.shift()}`}>Start Reading</Link>
        }
        </div>
      </div>
    )
  }
}
