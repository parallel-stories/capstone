// react
import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import { connect } from 'react-redux'

// login
import WhoAmI from './components/WhoAmI'
import firebase from 'app/fire'
const auth = firebase.auth()

// drawer menu for Navbar
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

// icons for Navbar
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/svg-icons/action/list'
import history from './history'

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleLink = this.handleLink.bind(this)
  }

  // handles the toggle of the left drawer menu
  handleToggle = () => {
    this.setState({open: !this.state.open})
  }

  handleLink = (e, type) => {
    history.push(`/${type}`)
    this.handleToggle()
  }

  render() {
    return (
      <AppBar
        title="Parallel Stories"
        iconElementLeft={<IconButton><List/></IconButton>}
        onLeftIconButtonTouchTap={this.handleToggle}
        style={{boxShadow: 'none', fontFamily: 'Berkshire Swash, cursive', textAlign: 'center'}}>
        <Drawer open={this.state.open}>
          <MenuItem onClick={(e) => { this.handleLink(e, 'home') }}>Home</MenuItem>
          <MenuItem onClick={(e) => { this.handleLink(e, 'write') }}>Write a Story</MenuItem>
          <MenuItem onClick={(e) => { this.handleLink(e, 'read') }}>Read Stories</MenuItem>
          <MenuItem onClick={(e) => { this.handleLink(e, 'userProfile') }}>User Profile</MenuItem>
          <MenuItem onClick={this.handleToggle} className="close-drawer">Close</MenuItem>
        </Drawer>
        <WhoAmI auth={auth} />
      </AppBar>
    )
  }
}

export default Navbar
