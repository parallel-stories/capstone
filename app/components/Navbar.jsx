// react
import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'

// drawer menu for Navbar
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

// icons for Navbar
import IconButton from 'material-ui/IconButton'
import Face from 'material-ui/svg-icons/action/face'
import List from 'material-ui/svg-icons/action/list'
import history from '../history'

// other components
import LandingPage from './LandingPage'
import WriteSpace from './WriteSpace'
import Footer from './Footer'

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
    this.handleToggle =  this.handleToggle.bind(this)
    this.handleLink = this.handleLink.bind(this)
  }

  // handles the toggle of the left drawer menu
  handleToggle = () => {
    this.setState({open: !this.state.open})
  }

  handleLink = (e, type) => {
    if (type === 'home') {
      history.push(`/home`)
    } else if (type === 'read') {
      console.log('clicked on read!')
    } else if (type === 'write') {
      history.push(`/write`)
    }
    this.handleToggle()
  }

  render() {
    return (
      <div>
        <AppBar
          title="Parallel Stories"
          onTitleTouchTap={(e) => { this.handleLink(e, 'home') }}
          iconElementLeft={<IconButton><List/></IconButton>}
          onLeftIconButtonTouchTap={this.handleToggle}
          iconElementRight={<IconButton><Face/></IconButton>}
          onRightIconButtonTouchTap={() => alert('implement login function pls')}
          style={{boxShadow: 'none', fontFamily: 'Pacifico', textAlign: 'center'}}
          className="header">
          <Drawer open={this.state.open}>
            <MenuItem onClick={(e) => { this.handleLink(e, 'home') }}>Home</MenuItem>
            <MenuItem onClick={(e) => { this.handleLink(e, 'read') }}>Read Stories</MenuItem>
            <MenuItem onClick={(e) => { this.handleLink(e, 'write') }}>Write a Story</MenuItem>
            <MenuItem onClick={this.handleToggle} className="close-drawer">Close</MenuItem>
          </Drawer>
        </AppBar>
      </div>
    )
  } // end render
};

export default Navbar
