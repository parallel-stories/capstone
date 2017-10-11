import React from 'react'

import firebase from 'app/fire'

// material ui
import FlatButton from 'material-ui/FlatButton'

import history from '../history'

const google = new firebase.auth.GoogleAuthProvider()

const loggingStyles = {
  button: {
    boxShadow: "none",
    minWidth:"75px",
    color: "#FFFFFF"
  },
}


// Firebase has several built in auth providers:
// const facebook = new firebase.auth.FacebookAuthProvider()
// const twitter = new firebase.auth.TwitterAuthProvider()
// const github = new firebase.auth.GithubAuthProvider()
// // This last one is the email and password login we all know and
// // vaguely tolerate:
// const email = new firebase.auth.EmailAuthProvider()

// If you want to request additional permissions, you'd do it
// like so:
//
// google.addScope('https://www.googleapis.com/auth/plus.login')
//
// What kind of permissions can you ask for? There's a lot:
//   https://developers.google.com/identity/protocols/googlescopes
//
// For instance, this line will request the ability to read, send,
// and generally manage a user's email:
//
// google.addScope('https://mail.google.com/')

export default ({ auth }) =>
  // signInWithPopup will try to open a login popup, and if it's blocked, it'll
  // redirect. If you prefer, you can signInWithRedirect, which always
  // redirects.
  <FlatButton
    className='google-login'
    onClick={() => auth.signInWithPopup(google).then( () => history.push(`/userProfile`) )}
    label="LOGIN"
    style={loggingStyles.button} />
