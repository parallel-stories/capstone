// react
import React, { Component } from 'react'

//react components
import Navbar from './Navbar'
import SingleCard from './SingleCard'

// material ui
import IconButton from 'material-ui/IconButton'
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import LeftArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

// react swipe components
import ReactDOM from 'react-dom';
import ReactSwipe from 'react-swipe';

class SingleCommunity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cards: ['card 1', 'card 2', 'card 3'],
    }
  }

  render() {
    return (
      <div>
        <Navbar/>
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
              <SingleCard />
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

export default SingleCommunity
