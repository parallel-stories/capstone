// react
import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'

// firebase
import firebase from 'app/fire'
import 'firebase/database'
const auth = firebase.auth()

//components
import AllStoryBranches from './AllStoryBranches'

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
  constructor(props){
    super(props)

    this.state = {
      user: {},
      uid: '',
      storyBranches: {}
    }

  }
  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user:user, uid:user.uid}, () => {
      firebase.database().ref().child('user').child(this.state.uid).child('storyBranches').on('value', snap => {
        this.setState({storyBranches: snap.val()})
      })
    }))
    
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {user , _ , storyBranches} = this.state || {}
    console.log('DA BRANCHES', storyBranches)
    return (
      <div className="container-fluid" >
        <h1>Welcome {name(user)}!</h1>
        <p>{email(user)} </p>
        <h1>My Story Branches</h1>
        <div className="row" >
          <AllStoryBranches searchResults={storyBranches} searching={true} />
        </div>
      </div>
    )
  }
}
