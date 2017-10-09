// react
import React, { Component } from 'react'
import {Link} from 'react-router-dom'

// react components
import SingleCard from './SingleCard'
import BranchStepper from './BranchStepper'

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
      branchingPointIndex: 0
    }
  }

  updateFullState = (branchId, cardId, info, branchingPointIndex) => {
    this.setState({
      currentStoryBranchId: branchId,
      currentStoryBranch: info[0].val(),
      currentCardId: cardId,
      selector: info[0].val().storyCards.indexOf(cardId),
      currentCard: info[1].val(),
      branchingPointIndex: branchingPointIndex
    })
  }

  componentDidMount() {
    const {branchId, cardId, branchingPointIndex} = this.props
    Promise.all([getStoryBranch(branchId), getStoryCard(cardId)])
    .then(info => this.updateFullState(branchId, cardId, info, branchingPointIndex))
  }

  componentWillReceiveProps(nextProps) {
    const {branchId, cardId, branchingPointIndex} = nextProps
    console.log('nav for:', branchId, cardId)
    Promise.all([getStoryBranch(branchId), getStoryCard(cardId)])
    .then(info => this.updateFullState(branchId, cardId, info, branchingPointIndex))
  }

  handleOptionClick = () => {
    const {childParent, currentCardId, currentStoryBranchId} = this.state
    this.setState({
      childParent: Object.assign(
        {},
        childParent,
        {[`${currentCardId}`]: [currentStoryBranchId, currentCardId]}
      )
    })
  }

  handleReturnToPrevBranch = () => {
    const childParent = this.state.childParent
    delete childParent[this.state.currentCardId]
    this.setState({childParent})
  }

  render() {
    const {
      currentStoryBranch,
      currentStoryBranchId,
      currentCard,
      isStart,
      isEnd,
      selector,
      branchingPointIndex
    } = this.state

    let parentBranchId, parentCardId
    if (this.state.childParent[this.state.currentCardId]) {
      parentBranchId = this.state.childParent[this.state.currentCardId][0]
      parentCardId = this.state.childParent[this.state.currentCardId][1]
    }

    const getStoryRootTitle = () => {
      const roots = _.isEmpty(currentStoryBranch) ? [] : currentStoryBranch.storyRoot
      return roots.length > 1 ? roots[roots.length - 1] : currentStoryBranchId
    }

    console.log('IN MOUNTED NAV STATE:', this.state)

    return (
      <div>
        {
          !_.isEmpty(currentStoryBranch) && (
          <div>
          {/*
            <div>
              <h2 className="align-center header">{currentStoryBranchId}</h2>
              <h4 className="align-center"> Root: "{getStoryRootTitle()}"</h4>
              <Divider />
              <br />
            </div>
          */}
            <div className="flex-container">
              {
                selector > branchingPointIndex
                ? <IconButton className="col swipe-btn-left-right flex-arrows">
                    <Link to={`/read/story_branch/${currentStoryBranchId}/${currentStoryBranch.storyCards[selector - 1]}`}>
                      <LeftArrow/>
                    </Link>
                  </IconButton>
                : <IconButton
                  disabled={true}
                  className="col swipe-btn-left-right flex-arrows"
                  >
                    <LeftArrow/>
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
                  disabled={true}
                  className="col swipe-btn-left-right flex-arrows"
                  >
                    <RightArrow />
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
