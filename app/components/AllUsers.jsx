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
    this.usersListener = firebase.database().ref().child('user')
    this.usersListener.on('value', snap => {
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
    if( this.usersListener ) this.usersListener.off()
    this.unsubscribe()
  }

  render() {
    const { users } = this.state

    return (
      <div className="container all-users">
        <br/>
        {
          !_.isEmpty(users) &&
          Object.keys(users).map(key =>
            <UserCard key={key}
              thisKey={key}
              user={this.state.users[key]}
              currentUser={this.state.currentUser}/>
          )
        }
        <br/>
        <br/>
      </div>
    )
  }
}
