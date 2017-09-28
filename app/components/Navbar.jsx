// react
import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

// drawer menu for Navbar
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

// icons for Navbar
import IconButton from 'material-ui/IconButton';
import Face from 'material-ui/svg-icons/action/face';
import List from 'material-ui/svg-icons/action/list';

// other components
import Auth from './Auth'

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  // handles the toggle of the left drawer menu
  handleToggle = () => {
    this.setState({open: !this.state.open});
  }

  render() {
    return (
      <div>
        <AppBar
          title="Parallel Stories"
          iconElementLeft={<IconButton><List/></IconButton>}
          onLeftIconButtonTouchTap={this.handleToggle}
          iconElementRight={<IconButton><Face/></IconButton>}
          onRightIconButtonTouchTap={() => alert('implement login function pls')}
      		style={{boxShadow:"none", fontFamily:"Pacifico", textAlign:"center"}}
      		className="header">
          <Drawer open={this.state.open}>
            <MenuItem>Read Stories</MenuItem>
            <MenuItem>Write a Story</MenuItem>
            <MenuItem onClick={this.handleToggle} className="close-drawer">Close</MenuItem>
          </Drawer>
        </AppBar>
      </div>
  )} // end render
};

export default Navbar;
