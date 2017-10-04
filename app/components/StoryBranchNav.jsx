// react
import React, { Component } from 'react'
import {Link} from 'react-router-dom'

// react components
import SingleCard from './SingleCard'
import OptionsCard from './OptionsCard'

// material ui
import IconButton from 'material-ui/IconButton'
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import LeftArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Snackbar from 'material-ui/Snackbar'

// react swipe components
import ReactDOM from 'react-dom'
import ReactSwipe from 'react-swipe'

// firebase
import firebase from 'app/fire'

// lodash
import _ from 'lodash'

// utils
// import {getCard} from '../utils'

class StoryBranchNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStoryBranchId: '',
      currentStoryBranch: {},
      currentCardId: '',
      currentCard: {},
      selector: 0,
      childParent: {},
      isReadingBranchOptions: false,
      isEnd: false,
      isStart: false
    }
  }

  componentDidMount() {
    const storyBranchId = this.props.match.params.branchId
    const cardId = this.props.match.params.cardId
    firebase.database().ref(`storyBranch/${storyBranchId}`).once('value', storySnap => {
      firebase.database().ref(`storyCard/${cardId}`).once('value', cardSnap => {
        const index = storySnap.val().storyCards.indexOf(+cardId)
        this.setState({currentStoryBranchId: storyBranchId, currentStoryBranch: storySnap.val(), currentCardId: cardId, selector: index, currentCard: cardSnap.val()})
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    const {branchId, cardId} = nextProps.match.params
    if (branchId === this.state.currentStoryBranchId) {
      if (cardId !== this.state.currentCardId) {
        const index = this.state.currentStoryBranch.storyCards.indexOf(+cardId)
        firebase.database().ref(`storyCard/${cardId}`).once('value', cardSnap => {
          this.setState({currentCardId: cardId, selector: index, currentCard: cardSnap.val()})
        })
      }
    } else {
      if (cardId !== this.state.currentCardId) {
        const storyBranchId = nextProps.match.params.branchId
        const cardId = nextProps.match.params.cardId
        firebase.database().ref(`storyBranch/${storyBranchId}`).once('value', storySnap => {
          firebase.database().ref(`storyCard/${cardId}`).once('value', cardSnap => {
            const index = storySnap.val().storyCards.indexOf(+cardId)
            this.setState({currentStoryBranchId: storyBranchId, currentStoryBranch: storySnap.val(), currentCardId: cardId, selector: index, currentCard: cardSnap.val()})
          })
        })
      }
    }
  }

  handleDownClick = () => {
    this.setState({isReadingBranchOptions: true})
  }

  getBranchOptions = () => {
    const branchTitles= Object.keys(this.state.currentCard.branches)
    const branchLinks = branchTitles.map(branch => (
      <Link
        key="branch"
        to={`/read/story_branch/${branch}/${this.state.currentCard.branches[branch]}`}
        onClick={() => this.setState({isReadingBranchOptions: false, childParent: Object.assign({}, this.state.childParent, {[`${5}`]: [this.state.currentStoryBranchId, this.state.currentCardId]})})}>
        {branch}
      </Link>
    ))
    return branchLinks
  }

  render() {
    const cancelReadBranchOptions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.setState({isReadingBranchOptions: false})}
      />
    ]
    const cancelStoryEndAlert = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.setState({isEnd: false})}
      />
    ]
    const cancelStoryStartAlert = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.setState({isStart: false})}
      />
    ]
    let parentBranchId, parentCardId
    if (this.state.childParent[this.state.currentCardId]) {
      parentBranchId = this.state.childParent[this.state.currentCardId][0]
      parentCardId = this.state.childParent[this.state.currentCardId][1]
    }

    return (
      <div>
        {
          !_.isEmpty(this.state.currentStoryBranch) && (
          <div>
            <div>
              <h1>STORY BRANCH: "{this.state.currentStoryBranchId}"</h1>
              <h3>ROOT: "{this.state.currentStoryBranch.storyRoot}"</h3>
            </div>
            <div className="row container-fluid">
              {
                parentCardId &&
                <Link to={`/read/story_branch/${parentBranchId}/${parentCardId}`}>
                  <IconButton className="swipe-btn-up-down" onClick={this.handleUpClick}>
                    <UpArrow/>
                  </IconButton>
                </Link>
              }
            </div>
            <div className="row card-container">
              {
                this.state.selector > 0
                ? <Link to={`/read/story_branch/${this.state.currentStoryBranchId}/${this.state.currentStoryBranch.storyCards[this.state.selector - 1]}`}>
                    <IconButton className="col swipe-btn-left-right">
                      <LeftArrow/>
                    </IconButton>
                  </Link>
                : <IconButton className="col swipe-btn-left-right" onClick={() => this.setState({isStart: true})}>
                    <LeftArrow/>
                    <Dialog
                    title=""
                    actions={cancelStoryStartAlert}
                    modal={true}
                    open={this.state.isStart}
                    >
                    This is the start of the story.
                    </Dialog>
                  </IconButton>
              }
              <ReactSwipe className="col carousel"
                          swipeOptions={{continuous: false}}
                          key={this.state.selector}>
                  <SingleCard currentCard={this.state.currentCard} />
              </ReactSwipe>
              {
                this.state.selector < this.state.currentStoryBranch.storyCards.length - 1
                ? <Link to={`/read/story_branch/${this.state.currentStoryBranchId}/${this.state.currentStoryBranch.storyCards[this.state.selector + 1]}`}>
                    <IconButton className="col swipe-btn-left-right">
                      <RightArrow />
                    </IconButton>
                  </Link>
                : <IconButton className="col swipe-btn-left-right" onClick={() => this.setState({isEnd: true})}>
                    <RightArrow />
                    <Dialog
                    title=""
                    actions={cancelStoryEndAlert}
                    modal={true}
                    open={this.state.isEnd}
                    >
                    Sorry. There are currently no more scenes for this story.
                    </Dialog>
                  </IconButton>
              }
            </div>
            {
              this.state.currentCard.branches && (
                <div className="row container-fluid">
                  <IconButton className="swipe-btn-up-down" onClick={this.handleDownClick}><DownArrow /></IconButton>
                  <Dialog
                  title="Choose another story branch:"
                  actions={cancelReadBranchOptions}
                  modal={true}
                  open={this.state.isReadingBranchOptions}
                  autoScrollBodyContent={true}
                  >
                  {this.getBranchOptions()}
                  </Dialog>
                </div>
              )
            }
          </div>
        )}
      </div>
    )
  }
}

export default StoryBranchNav
