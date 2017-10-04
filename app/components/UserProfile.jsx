// react
import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'

// material ui
import RaisedButton from 'material-ui/RaisedButton'

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
      storyBranches: {}
    }

    this.handleLink = this.handleLink.bind(this)

  }
  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }, () => {
      if( user ) {
        firebase.database().ref().child('user').child(this.state.user.uid).child('storyBranches').on('value', snap => {
          this.setState({storyBranches: snap.val()})
        })
      }
    }))

  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  // OB/FF: if you can do an <a /> or a <Link /> instead that'd be ideal
  handleLink = (e, type) => {
    if (type === 'write') {
      this.props.history.push(`/write`)
    }
  }

  render() {
    // OB/FF: don't need the _ here right?
    const {user , _ , storyBranches} = this.state || {}

    return (
      <div className="container-fluid" >
        {!user ?
          <h1>Please login to view profile </h1>
          :
          <div>
            <h1>Welcome {user.displayName}!</h1>
            <p>{user.email} </p>
            <h1>My Story Branches</h1>
            { !storyBranches ?
              <div>
                <p>
                  It looks like you didn't write any stories yet.
                  Click the button below to start writing a story.
                </p>
                <RaisedButton
                  label="Write a New Story"
                  onClick={(e) => { this.handleLink(e, 'write') }}
                />
              </div>
              :
              <div className="row" >
                <AllStoryBranches searchResults={storyBranches} searching={true} />
              </div>
            }
          </div>
        }
      </div>
    )
  }
}
