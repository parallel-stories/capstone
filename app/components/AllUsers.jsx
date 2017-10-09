import React, { Component } from 'react'

import _ from 'lodash'

import firebase from 'app/fire'
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
    const filtered = this.props.filtered
    const followedUsers = this.props.followedUsers
    let filteredUsers = {}

    if( filtered === true ) {
      for( const key of Object.keys(followedUsers) ){
        if( users[key] ) filteredUsers[key] = users[key]
      }
    }

    return (
      <div className="container all-users">
        <br/>
          {
            /* if this is called from the user profile component -- ie filtered is true --
              use the first rendering code
              otherwise, use the second
            */
          }
          {
            filtered ?
            !_.isEmpty(filteredUsers) &&
            Object.keys(filteredUsers).map(key =>
              <UserCard key={key}
                thisKey={key}
                user={filteredUsers[key]}
                currentUser={this.state.currentUser}/>
            )
            :
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
