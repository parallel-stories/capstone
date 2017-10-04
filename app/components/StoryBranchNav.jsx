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
      cards: [],
      selector: 0,
      childParent: [],
      isReadingBranchOptions: false
    }
    this.handleRightClick = this.handleRightClick.bind(this)
    this.handleLeftClick = this.handleLeftClick.bind(this)
    this.handleDownClick = this.handleDownClick.bind(this)
    this.handleUpClick = this.handleUpClick.bind(this)
  }

  componentDidMount() {
    if (_.isEmpty(this.props.currentStoryBranch)) {
      const storyBranchId = this.props.match.params.branchId
      firebase.database().ref(`storyBranch/${storyBranchId}`).once('value', snap => {
        const storyBranch = snap.val()
        return this.props.handleCurrentStoryChange(storyBranchId, storyBranch)
      })
      .then(() => {
        firebase.database().ref(`storyCard/${this.props.match.params.cardId}`).once('value', snap => {
          this.setState({cards: [...this.state.cards, snap.val()]})
        })
      })
    } else {
      firebase.database().ref(`storyCard/${this.props.match.params.cardId}`).once('value', snap => {
        this.setState({cards: [...this.state.cards, snap.val()]})
      })
    }
  }

  handleRightClick = () => {
    const nextCardId = this.state.cards[this.state.selector].nextCard

    if (nextCardId !== '') {
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
    const newBranchCardId = this.state.cards[this.state.selector].branches[branch]
    firebase.database().ref(`storyCard/${newBranchCardId}`).once('value', snap => {
      this.setState({
        isReadingBranchOptions: false,
        childParent: [...this.state.childParent, this.state.selector + 1],
        cards: [...(this.state.cards.slice(0, this.state.selector + 1)), snap.val()],
        selector: this.state.selector + 1
      })
    })
  }

  handleUpClick = () => {
    if (this.state.childParent.includes(this.state.selector)) {
      const childParent = this.state.childParent
      childParent.splice(this.state.childParent.indexOf(this.state.selector), 1)
      this.setState({cards: this.state.cards.slice(0, this.state.selector), selector: this.state.selector - 1, childParent: childParent})
    }
  }

  render() {
    return (
      <div>
        <div className="row container-fluid">
          <IconButton className="swipe-btn-up-down" onClick={this.handleUpClick}><UpArrow/></IconButton>
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
