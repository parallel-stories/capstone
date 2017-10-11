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

// react swipe components
import ReactDOM from 'react-dom'
import ReactSwipe from 'react-swipe'

// firebase
import firebase from 'app/fire'

// lodash
import _ from 'lodash'

// utils
import {getStoryBranch, getStoryCard} from '../utils/storyBranchNavUtils'
import history from '../history'

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

  arrowKeyPress = (e) => {
    if (e.keyCode == 37) this.handleNavClick('left')
    if (e.keyCode == 39) this.handleNavClick('right')
  }

  componentDidMount() {
    document.addEventListener('keydown', this.arrowKeyPress.bind(this))
    const {branchId, cardId, branchingPointIndex} = this.props
    Promise.all([getStoryBranch(branchId), getStoryCard(cardId)])
    .then(info => this.updateFullState(branchId, cardId, info, branchingPointIndex))
  }

  componentWillReceiveProps(nextProps) {
    const {branchId, cardId, branchingPointIndex} = nextProps
    Promise.all([getStoryBranch(branchId), getStoryCard(cardId)])
    .then(info => this.updateFullState(branchId, cardId, info, branchingPointIndex))
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.arrowKeyPress.bind(this))
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

  handleNavClick = (direction) => {
    const {currentStoryBranchId, currentStoryBranch, selector} = this.state
    switch (direction) {
    case 'left':
      history.push(`/read/${currentStoryBranchId}/${currentStoryBranch.storyCards[selector - 1]}`)
      break
    case 'right':
      history.push(`/read/${currentStoryBranchId}/${currentStoryBranch.storyCards[selector + 1]}`)
      break
    default:
      break
    }
  }

  render() {
    const {
      currentStoryBranch,
      currentStoryBranchId,
      currentCard,
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
      return roots.length > 1 ? roots[roots.length - 1].replace(/"/g, '') : currentStoryBranchId
    }

    const navButtonStyle = {
      icon: {
        width: '70px',
        height: '70px'
      },
      button: {
        width: '70px',
        height: '70px',
        padding: '20px'
      }
    }

    return (
      <div>
        {
          !_.isEmpty(currentStoryBranch) && (
          <div className="flex-container">
              {
                selector > branchingPointIndex
                ? <IconButton
                  iconStyle={navButtonStyle.icon}
                  style={navButtonStyle.button}
                  className="col swipe-btn-left-right flex-arrows"
                  onClick={() => this.handleNavClick('left')}
                  tooltip="Go to previous scene"
                  tooltipPosition={'bottom-right'}
                  touch={true}
                  >
                    <LeftArrow color="#006064"/>
                  </IconButton>
                : <IconButton
                  iconStyle={navButtonStyle.icon}
                  style={navButtonStyle.button}
                  disabled={true}
                  className="col swipe-btn-left-right flex-arrows"
                  >
                    <LeftArrow color="#006064" />
                  </IconButton>
              }
              <ReactSwipe className="flex-card carousel"
                          swipeOptions={{continuous: false}}
                          key={selector}>
                  <SingleCard
                    currentState={this.state}
                    parent={parentCardId ? {parentBranchId, parentCardId} : false}
                    handleOptionClick={this.handleOptionClick}
                  />
              </ReactSwipe>
              {
                selector < currentStoryBranch.storyCards.length - 1
                ? <IconButton
                  iconStyle={navButtonStyle.icon}
                  style={navButtonStyle.button}
                  className="col swipe-btn-left-right flex-arrows"
                  onClick={() => this.handleNavClick('right')}
                  tooltip="Go to next scene"
                  touch={true}
                  >
                      <RightArrow color="#006064" />
                  </IconButton>
                : <IconButton
                  iconStyle={navButtonStyle.icon}
                  style={navButtonStyle.button}
                  disabled={true}
                  className="col swipe-btn-left-right flex-arrows"
                  >
                    <RightArrow color="#006064" />
                  </IconButton>
              }
          </div>
        )}
      </div>
    )
  }
}

export default StoryBranchNav
