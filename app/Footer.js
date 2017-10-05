import React from 'react'
import IconButton from 'material-ui/IconButton'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import muiThemeable from 'material-ui/styles/muiThemeable'

const Footer = () => (
  <div className="footer align-center">
  Made with{' '}<span role="img" aria-label="heart emoji">💕</span>{' '}by Jamie, Jennifer, Mieka & Raz{' '}/{' '}Find us on{' '}<a target="_blank" href="https://github.com/parallel-stories/capstone">GitHub</a>
  </div>
)

export default Footer
