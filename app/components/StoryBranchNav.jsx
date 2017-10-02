// react
import React, { Component } from 'react'

// react components
import SingleCard from './SingleCard'

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
      selector: 0
    }
    this.handleRightClick = this.handleRightClick.bind(this)
  }

  componentDidMount() {
    console.log(this.props)
    if (_.isEmpty(this.props.currentStoryBranch)) {
      console.log('EMPTY STORY')
      const storyBranchId = this.props.match.params.branchId
      // getCard.call(this, storyBranchId, this.props.match.params.cardId, this.props.handleCurrentStoryChange)
      firebase.database().ref(`storyBranch/${storyBranchId}`).once('value', snap => {
        const storyBranch = snap.val()
        return this.props.handleCurrentStoryChange(storyBranchId, storyBranch)
      })
      .then(() => {
        firebase.database().ref(`storyCard/${this.props.match.params.cardId}`).once('value', snap => {
          console.log('set val after empty')
          this.setState({cards: [...this.state.cards, snap.val()]})
        })
      })
    } else {
      console.log('THE ELSE', this.props.match.params.cardId)
      firebase.database().ref(`storyCard/${this.props.match.params.cardId}`).once('value', snap => {
        console.log('set val if not empty')
        this.setState({cards: [...this.state.cards, snap.val()]})
      })
    }
    console.log('HELLO')
  }

  handleRightClick = (evt) => {
    //put logic that is no next card, don't do anything OR disable button
    const nextCardId = this.state.cards[this.state.selector].nextCard
    console.log('NEXT CARD', nextCardId)
    firebase.database().ref(`storyCard/${nextCardId}`).once('value', snap => {
      this.setState({selector: this.state.selector + 1, cards: [...this.state.cards, snap.val()]})
    })
  }

  render() {
    console.log('STATE', this.state)
    return (
      <div>
        <div className="row container-fluid">
          <IconButton className="swipe-btn-up-down"><UpArrow/></IconButton>
        </div>
        <div className="row card-container">
          <IconButton className="col swipe-btn-left-right">
            <LeftArrow/>
          </IconButton>
          <ReactSwipe className="col carousel"
                      swipeOptions={{continuous: false}}
                      key={this.state.selector}>
              <SingleCard currentCard={this.state.cards[this.state.selector]} />
          </ReactSwipe>
          <IconButton className="col swipe-btn-left-right" onClick={this.handleRightClick}>
            <RightArrow />
          </IconButton>
        </div>
        <div className="row container-fluid">
          <IconButton className="swipe-btn-up-down"><DownArrow /></IconButton>
        </div>
      </div>
    )
  } // end return
}

export default StoryBranchNav
