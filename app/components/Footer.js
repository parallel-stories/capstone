import React from 'react';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';

const styles = {
	link: { textDecoration: 'none', color: '#26C6DA' },
  center: { textAlign: 'center' }
};

const Footer = () => (
  <div style={styles.center} className="container container-fluid">
  	Made with{' '}
  	<span role="img" aria-label="heart emoji"> ❤️ </span>{' '}
  	by Jamie, Jennifer, Mieka, and Raz{' '}
  	/ Find us on{' '}
  	<a target="_blank" href="https://github.com/parallel-stories/capstone" style={styles.link}>
  	GitHub
  	</a>
  </div>
);

export default Footer;
