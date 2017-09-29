// react
import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'

// firebase
import firebase from 'app/fire'
const auth = firebase.auth()

export const name = user => {
  if (!user) return 'Nobody'
  if (user.isAnonymous) return 'Anonymous'
  return user.displayName || user.email
}

export const email = user => {
  if (!user) return null
  if (user.isAnonymous) return null
  return `Email: ${user.email}`
}

export default class UserProfile extends Component {
  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {user} = this.state || {}

    return (
      <div className="container-fluid" >
        <h1>Welcome {name(user)}!</h1>
        <p>{email(user)} </p>
        <div className="row" >

        </div>
      </div>
    )
  }
}
