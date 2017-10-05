import React, { Component } from 'react'
import firebase from 'app/fire'
import 'firebase/database'
import _ from 'lodash'
import { Link } from 'react-router-dom'

import UserCard from './UserCard'

export default class AllUsers extends Component {
  constructor() {
    super()
    this.state = {
      users: {}
    }
  }

  componentDidMount() {
    firebase.database().ref().child('user').on('value', snap => {
      const users = snap.val()
      this.setState({ users })
    })
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
            <Link to='/allUsers/:id' key={key}>
              <UserCard key={key}/>
            </Link>
          )
        }
        <br/>
      </div>
    )
  }
}
