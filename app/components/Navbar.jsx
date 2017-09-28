// react
import React from 'react';
import AppBar from 'material-ui/AppBar';

// icons for Navbar
import IconButton from 'material-ui/IconButton';
import Face from 'material-ui/svg-icons/action/face';

// other components
import Auth from './Auth'

function handleTouchTapRight() {
  alert('Put a login here!!');
}

const Navbar = () => (
  <div>
    <AppBar
      title="Parallel Stories"
      iconClassNameRight="muidocs-icon-navigation-expand-more"
      iconElementRight={<IconButton><Face/></IconButton>}
      onRightIconButtonTouchTap={handleTouchTapRight}
  		style={{boxShadow:"none", fontFamily:"Pacifico", textAlign:"center"}}
  		className="header"
    />
  </div>
);

export default Navbar;
