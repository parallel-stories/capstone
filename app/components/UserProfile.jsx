// react
import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'

// firebase
import firebase from 'app/fire'
import 'firebase/database'
const auth = firebase.auth()

//components
import AllStoryBranches from './AllStoryBranches'

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
    console.log('DA BRANCHES', user.email)
    return (
      <div className="container-fluid" >
        {!user.email ? <h1>Please login to view profile </h1> : 
          <div>
            <h1>Welcome {user.displayName}!</h1>
            <p>{user.email} </p>
            <h1>My Story Branches</h1>
            <div className="row" >
              <AllStoryBranches searchResults={storyBranches} searching={true} />
            </div>
          </div>
        }
      </div>
    )
  }
}
