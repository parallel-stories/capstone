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
import AllUsers from './AllUsers'

import _ from 'lodash'

// styling for button
const landingStyles = {
  button: {
    boxShadow: "none",
    marginBottom: "20px",
    minWidth:"75px"
  },
}

export default class UserProfile extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: {},
      storyBranches: {},
      favorites: {},
      usersFollowed: {},
    }
    this.handleLink = this.handleLink.bind(this)
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }, () => {
      if (user) {
        this.branchListener = firebase.database().ref(`user/${this.state.user.uid}/storyBranches`)
        this.favesListener = firebase.database().ref(`user/${this.state.user.uid}/faves`)
        this.followListener = firebase.database().ref(`user/${this.state.user.uid}/following`)
        this.branchListener.on('value', branches => {
          this.favesListener.on('value', faves => {
            this.favesListener.on('value', follows => {
              this.setState({
                storyBranches: !branches.val() ? {} : branches.val(),
                favorites: !faves.val() ? {} : faves.val(),
                usersFollowed: !follows.val() ? {} : follows.val(),
              })
            })
          })
        })
      }
    }))
  }

  componentWillUnmount() {
    if (this.branchListener) this.branchListener.off()
    if (this.favesListener) this.favesListener.off()
    if (this.usersFollowed) this.usersFollowed.off()
    this.unsubscribe()
  }

  handleLink = (e, type) => {
    this.props.history.push(`/${type}`)
  }

  render() {
    const { user, storyBranches, favorites, usersFollowed } = this.state

    return (
      <div className="container-fluid" >
        {!user ?
          <h1>Please login to view profile </h1>
          :
          <div>
            <h1>Welcome {user.displayName}!</h1>
            <p>{user.email} </p>
            <h2>My Story Branches</h2>
            { _.isEmpty(storyBranches)
              ? (<div>
                  <p>
                    It looks like you didn't write any stories yet.
                    Click the button below to start writing a story.
                  </p>
                  <RaisedButton
                    label="Write a New Story"
                    onClick={(e) => { this.handleLink(e, 'write') }}
                    backgroundColor='#50AD55'
                    style={landingStyles.button}
                  />
                </div>)
              : (<div className="row" >
                  <AllStoryBranches searchResults={storyBranches} searching={true} />
                </div>)
            }
            <hr />
            <h2>Favorited Stories</h2>
            { _.isEmpty(favorites)
              ? (<div>
                  <p>
                    It looks like you didn't favorite any stories yet.
                    Click the button below to favorite some!
                  </p>
                  <RaisedButton
                    label="Read Stories"
                    onClick={(e) => { this.handleLink(e, 'read') }}
                    backgroundColor='#D1B38E'
                    style={landingStyles.button}
                  />
                </div>)
              : (<div className="row" >
                  <AllStoryBranches searchResults={favorites} searching={true} />
                </div>)
            }
            <h2>Users You're Following</h2>
            { _.isEmpty(usersFollowed)?
              <div>
                <p>
                You're not currently following anyone!
                Click the button below to see what other users are up to!
                </p>
                <RaisedButton
                  label="All Users"
                  onClick={(e) => { this.handleLink(e, 'allUsers') }}
                  backgroundColor='#D1B38E'
                  style={landingStyles.button}
                />
            </div>
            :
            <div className="row" >
              <AllUsers
                filtered={true}
                userId={this.state.user.uid}
                followedUsers={this.state.usersFollowed}/>
            </div>
          }
          </div>
        } {/* end check to see if user is logged in */}
        <br />
        <br />
      </div>
    )
  }
}
