// react
import React, { Component } from 'react'
import {Link} from 'react-router-dom'

// react components
import SingleCard from './SingleCard'

// material ui
import IconButton from 'material-ui/IconButton'
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import LeftArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'

// react swipe components
import ReactDOM from 'react-dom'
import ReactSwipe from 'react-swipe'

// firebase
import firebase from 'app/fire'

// lodash
import _ from 'lodash'

// utils
import {getStoryBranch, getStoryCard, getDialogBox, getCancelAlertButton} from '../utils/storyBranchNavUtils'

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
      isEnd: false,
      isStart: false
    }
  }

  updateFullState = (branchId, cardId, info) => {
    this.setState({
      currentStoryBranchId: branchId,
      currentStoryBranch: info[0].val(),
      currentCardId: cardId,
      selector: info[0].val().storyCards.indexOf(cardId),
      currentCard: info[1].val()
    })
  }

  componentDidMount() {
    const {branchId, cardId} = this.props.match.params
    Promise.all([getStoryBranch(branchId), getStoryCard(cardId)])
    .then(info => this.updateFullState(branchId, cardId, info))
  }

  componentWillReceiveProps(nextProps) {
    const {branchId, cardId} = nextProps.match.params
    if (branchId === this.state.currentStoryBranchId && cardId !== this.state.currentCardId) {
      getStoryCard(cardId).then(cardSnap => this.setState({
        currentCardId: cardId,
        selector: this.state.currentStoryBranch.storyCards.indexOf(cardId),
        currentCard: cardSnap.val()
      }))
    } else {
      Promise.all([getStoryBranch(branchId), getStoryCard(cardId)])
      .then(info => this.updateFullState(branchId, cardId, info))
    }
  }

  handleOptionClick = () => {
    const {childParent, currentCardId, currentStoryBranchId} = this.state
    this.setState({childParent: Object.assign(
      {},
      childParent,
      {[`${currentCardId}`]: [currentStoryBranchId, currentCardId]}
    )})
  }

  handleReturnToPrevBranch = () => {
    const childParent = this.state.childParent
    delete childParent[this.state.currentCardId]
    this.setState({childParent})
  }

  render() {
    const {currentStoryBranch, currentStoryBranchId, currentCard, isStart, isEnd, selector} = this.state

    let parentBranchId, parentCardId
    if (this.state.childParent[this.state.currentCardId]) {
      parentBranchId = this.state.childParent[this.state.currentCardId][0]
      parentCardId = this.state.childParent[this.state.currentCardId][1]
    }

    const getStoryRootTitle = () => {
      const roots = _.isEmpty(currentStoryBranch) ? [] : currentStoryBranch.storyRoot
      return roots.length > 1 ? roots[roots.length - 1] : currentStoryBranchId
    }

    return (
      <div>
        {
          !_.isEmpty(currentStoryBranch) && (
          <div>
            <div>
              <h2 className="align-center header">{currentStoryBranchId}</h2>
              <h4 className="align-center"> Root: "{getStoryRootTitle()}"</h4>
              <Divider />
              <br />
            </div>
            <div className="flex-container">
              {
                selector > 0
                ? <IconButton className="col swipe-btn-left-right flex-arrows">
                    <Link to={`/read/story_branch/${currentStoryBranchId}/${currentStoryBranch.storyCards[selector - 1]}`}>
                      <LeftArrow/>
                    </Link>
                  </IconButton>
                : <IconButton
                  className="col swipe-btn-left-right flex-arrows"
                  onClick={() => this.setState({isStart: true})}
                  >
                    <LeftArrow/>
                    {
                      getDialogBox(
                        '',
                        'This is the start of the story.',
                        getCancelAlertButton(() => this.setState({isStart: false})),
                        isStart,
                        false
                      )
                    }
                  </IconButton>
              }
              <ReactSwipe className="flex-card carousel"
                          swipeOptions={{continuous: false}}
                          key={selector}>
                  <SingleCard
                    currentState={this.state}
                    parent={parentCardId ? {parentBranchId, parentCardId} : false}
                    handleReturnToPrevBranch={this.handleReturnToPrevBranch}
                    handleOptionClick={this.handleOptionClick}
                  />
              </ReactSwipe>
              {
                selector < currentStoryBranch.storyCards.length - 1
                ? <IconButton className="col swipe-btn-left-right flex-arrows">
                    <Link to={`/read/story_branch/${currentStoryBranchId}/${currentStoryBranch.storyCards[selector + 1]}`}>
                      <RightArrow />
                    </Link>
                  </IconButton>
                : <IconButton
                  className="col swipe-btn-left-right flex-arrows"
                  onClick={() => this.setState({isEnd: true})}
                  >
                    <RightArrow />
                    {
                      getDialogBox(
                        '',
                        'Sorry. There are currently no more scenes for this story.',
                        getCancelAlertButton(() => this.setState({isEnd: false})),
                        isEnd,
                        false
                      )
                    }
                  </IconButton>
              }
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default StoryBranchNav
