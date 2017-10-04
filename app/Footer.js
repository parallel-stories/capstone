import React from 'react'
import IconButton from 'material-ui/IconButton'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import muiThemeable from 'material-ui/styles/muiThemeable'

const Footer = () => (
  // OB/FF: watch out for zero-width characters
  <div className="footer alignCenter">
  Made with&nbsp;<span role="img" aria-label="heart emoji">❤️</span>&nbsp;&nbsp;&nbsp;by Jamie, Jennifer, Mieka, &amp; Raz&nbsp;/&nbsp;Find us on&nbsp;<a target="_blank" href="https://github.com/parallel-stories/capstone">GitHub</a>
  </div>
)

export default Footer
