import React, { Component } from 'react'

import _ from 'lodash'

import firebase from 'app/fire'
import 'firebase/database'
const auth = firebase.auth()

import UserCard from './UserCard'

export default class AllUsers extends Component {
  constructor() {
    super()
    this.state = {
      users: {},
      currentUser: {}
    }
  }

  componentDidMount() {
    firebase.database().ref().child('user').on('value', snap => {
      const users = snap.val()
      this.setState({ users })
    })
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }, () => {
      if( user ) {
        this.setState({ currentUser: user, })
      }
    })) //end auth
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { users } = this.state

    return (
      <div className="container">
        <br/>
        {
          /* if this is called from the searchbar component -- searhing is true --
            use the first rendering code
            otherwise, use the second
          */
        }
        {
          !_.isEmpty(users) &&
          Object.keys(users).map((key) =>
            <UserCard key={key} thisKey={key} currentUser={this.state.currentUser}/>
          )
        }
        <br/>
      </div>
    )
  }
}
