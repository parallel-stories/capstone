import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import firebase from 'app/fire'
import _ from 'lodash'
import FlatButton from 'material-ui/FlatButton'

// react components
import Reviews from './Reviews'

// tagging imports
import ChipInput from 'material-ui-chip-input'


export default class SingleStoryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStoryBranch: {},
      tags: [],
    }
  }

  componentDidMount() {
    const storyBranchId = this.props.match.params.branchId
    firebase.database().ref(`storyBranch/${storyBranchId}`).once('value', snap => {
      this.setState({currentStoryBranch: snap.val()})
    })
  }

  handleAddTag = (newTag) => {
    this.setState({
      tags: [...this.state.tags, newTag]
    })
    firebase.database().ref('tags').child(newTag).child(this.props.match.params.branchId).set(true)
  }


  handleDeleteTag = (deleteMe) => {
    this.setState({
      tags: this.state.tags.filter((c) => c !== deleteMe)
    })
    firebase.database().ref('tags').child(deleteMe).child(this.props.match.params.branchId).remove()
  }

  render() {
    const storyBranchId = this.props.match.params.branchId
    const storyBranch = this.state.currentStoryBranch

    const getStoryRootTitle = () => {
      const roots = _.isEmpty(storyBranch) ? [] : storyBranch.storyRoot
      return roots.length > 1 ? roots[roots.length - 1].replace(/"/g,"") : storyBranchId.replace(/"/g,"")
    }

    return (
      <div className="story-container">
        <div>
          <h2 className="align-center">{storyBranchId}</h2>
          <h4 className="align-center">Root:{' '}<a href={`/read/${getStoryRootTitle()}`}>"{getStoryRootTitle()}"</a></h4>
          <span>
            <img className="story-branch" src="http://lorempixel.com/400/200/" alt="This is an amazing picture." />
          </span>
          <br/>
        </div>
        <div className="start-read">
          {
            !_.isEmpty(storyBranch) &&
            <Link to={`/read/${storyBranchId}/${storyBranch.storyCards.shift()}`}><FlatButton label="Start Reading" backgroundColor="#50AD55"></FlatButton></Link>
          }
        </div>
        <div className="start-read">
          <ChipInput
            value={this.state.tags}
            fullWidth={true}
            hintText="Add a Tag"
            onRequestAdd={(chip) => this.handleAddTag(chip)}
            onRequestDelete={(chip, index) => this.handleDeleteTag(chip, index)}
            />
        </div>
        <Reviews storyId={storyBranchId}/>
      </div>
    )
  }
}
