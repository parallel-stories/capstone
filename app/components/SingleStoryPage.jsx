import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import firebase from 'app/fire'
import _ from 'lodash'
import FlatButton from 'material-ui/FlatButton'

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

    const getStoryRootTitle = () => {
      const roots = _.isEmpty(storyBranch) ? [] : storyBranch.storyRoot
      return roots.length > 1 ? roots[roots.length - 1] : storyBranchId
    }

    return (
      <div className="story-container">
        <div className="story-container">
          <h2 className="align-center">{storyBranchId}</h2>
          <h4 className="align-center">Root: "{getStoryRootTitle()}"</h4>
          <img className="story-branch" src="http://lorempixel.com/400/200/" alt="This is an amazing picture." />
        </div>
        <div className="start-read">
          {
            !_.isEmpty(storyBranch) &&
            <Link to={`/read/story_branch/${storyBranchId}/${storyBranch.storyCards.shift()}`}><FlatButton label="Start Reading" backgroundColor="#50AD55"></FlatButton></Link>
          }
        </div>
      </div>
    )
  }
}
