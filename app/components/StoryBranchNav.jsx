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

class StoryBranchNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cards: [],
      counter: 0
    }
  }

  componentDidMount() {
    console.log(this.props)
    if (_.isEmpty(this.props.currentStoryBranch)) {
      console.log('EMPTY STORY')
      const storyBranchId = this.props.match.params.branchId
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
                      key={this.state.cards.length}>
              <SingleCard currentCard={this.state.cards[this.state.counter]} />
          </ReactSwipe>
          <IconButton className="col swipe-btn-left-right">
            <RightArrow/>
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
