// react
import React, { Component } from 'react'

// react components
import SingleCard from './SingleCard'
import OptionsCard from './OptionsCard'

// material ui
import IconButton from 'material-ui/IconButton'
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import LeftArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

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
      currentStoryBranchTitle: '',
      currentStoryBranch: {},
      cards: [],
      selector: 0,
      childParent: {},
      isReadingBranchOptions: false
    }
    this.handleRightClick = this.handleRightClick.bind(this)
    this.handleLeftClick = this.handleLeftClick.bind(this)
    this.handleDownClick = this.handleDownClick.bind(this)
    this.handleUpClick = this.handleUpClick.bind(this)
  }

  componentDidMount() {
    const storyBranchId = this.props.match.params.branchId
    const cardId = this.props.match.params.cardId
    firebase.database().ref(`storyBranch/${storyBranchId}`).once('value', storySnap => {
      firebase.database().ref(`storyCard/${cardId}`).once('value', cardSnap => {
        this.setState({currentStoryBranchTitle: storyBranchId, currentStoryBranch: storySnap.val(), cards: [...this.state.cards, cardSnap.val()]})
      })
    })
  }

  handleRightClick = () => {
    // may not work if you start on a different branch vs original root branch?
    const nextCardId = this.state.currentStoryBranch.storyCards[this.state.selector + 1]
    if (nextCardId) {
      firebase.database().ref(`storyCard/${nextCardId}`).once('value', snap => {
        this.setState({selector: this.state.selector + 1, cards: [...this.state.cards, snap.val()]})
      })
    }
  }

  handleLeftClick = () => {
    if (this.state.selector) {
      this.setState({selector: this.state.selector - 1})
    }
  }

  handleDownClick = () => {
    if (this.state.cards[this.state.selector].branches) {
      this.setState({isReadingBranchOptions: true})
    }
  }

  handleOptionClick = (branch) => {
    // make sure to take check if you are already on a branch? or the original branch??
    // maybe cards should also hold their own branch and then it gets manually removed from the list?
    firebase.database().ref(`storyBranch/${branch}`).once('value', storySnap => {
      const newBranchCardId = this.state.cards[this.state.selector].branches[branch]
      firebase.database().ref(`storyCard/${newBranchCardId}`).once('value', cardSnap => {
        this.setState({
          currentStoryBranchTitle: branch,
          currentStoryBranch: storySnap.val(),
          isReadingBranchOptions: false,
          childParent: Object.assign({}, this.state.childParent, {[`${this.state.selector + 1}`]: this.state.currentStoryBranchTitle}),
          cards: [...(this.state.cards.slice(0, this.state.selector + 1)), cardSnap.val()],
          selector: this.state.selector + 1
        })
      })
    })
  }

  handleUpClick = () => {
    const title = this.state.childParent[this.state.selector]
    if (title) {
      const childParent = this.state.childParent
      delete childParent[this.state.selector]
      firebase.database().ref(`storyBranch/${title}`).once('value', storySnap => {
        console.log(storySnap.val())
        this.setState({
          currentStoryBranchTitle: title,
          currentStoryBranch: storySnap.val(),
          cards: this.state.cards.slice(0, this.state.selector),
          selector: this.state.selector - 1,
          childParent: childParent})
      })
    }
  }

  render() {
    return (
      <div>
        <div>
          <h1>STORY BRANCH: "{this.state.currentStoryBranchTitle}"</h1>
          <h3>ROOT: "{this.state.currentStoryBranch.storyRoot}"</h3>
        </div>
        <div className="row container-fluid">
          <IconButton className="swipe-btn-up-down" onClick={this.handleUpClick}>
            <UpArrow/>
          </IconButton>
        </div>
        <div className="row card-container">
          <IconButton className="col swipe-btn-left-right" onClick={this.handleLeftClick}>
            <LeftArrow/>
          </IconButton>
          <ReactSwipe className="col carousel"
                      swipeOptions={{continuous: false}}
                      key={this.state.selector}>
              {
                this.state.isReadingBranchOptions
                ? <OptionsCard branches={this.state.cards[this.state.selector].branches} handleOptionClick={this.handleOptionClick} />
                : <SingleCard currentCard={this.state.cards[this.state.selector]} />
              }
          </ReactSwipe>
          <IconButton className="col swipe-btn-left-right" onClick={this.handleRightClick}>
            <RightArrow />
          </IconButton>
        </div>
        <div className="row container-fluid">
          <IconButton className="swipe-btn-up-down" onClick={this.handleDownClick}><DownArrow /></IconButton>
        </div>
      </div>
    )
  }
}

export default StoryBranchNav
