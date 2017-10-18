// react
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'

// material ui
import RaisedButton from 'material-ui/RaisedButton'

// firebase
import firebase from 'app/fire'
const auth = firebase.auth()

//components
import AllStoryBranches from './AllStoryBranches'
import AllUsers from './AllUsers'
import EditUserProfile from './EditUserProfile'

import _ from 'lodash'
import { getCardBranchScene } from '../utils/userProfile.js'

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
      unpublishedCards:{},
      favorites: {},
      bookmarks: {},
      usersFollowed: {},
      displayName: '',
      description: '',
      isEditing: false,
      resolvedDrafts: []
    }
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }, () => {
      if (user) {
        this.userListener = firebase.database().ref(`user/${this.state.user.uid}`)

        this.userListener.on('value', user => {
          this.setState({
            storyBranches: !user.val().storyBranches ? {} : user.val().storyBranches,
            unpublishedCards: !user.val().unpublishedCards ? {} : user.val().unpublishedCards,
            favorites: !user.val().faves ? {} : user.val().faves,
            bookmarks: !user.val().bookmarks ? {} : user.val().bookmarks,
            usersFollowed: !user.val().following ? {} : user.val().following,
            displayName: !user.val().username? '' : user.val().username,
            description: !user.val().description? '' : user.val().description,
          }, () => {
            let draftCards = Object.keys(this.state.unpublishedCards).map(cardId => {
              return getCardBranchScene(cardId)
            })
            Promise.all(draftCards)
            .then(resolvedDrafts => {
              this.setState({resolvedDrafts})
            })
        })
      })
    }
  }))
  }

  componentWillUnmount() {
    if (this.userListener) this.userListener.off()
    this.unsubscribe()
  }

  handleLink = (e, type) => {
    this.props.history.push(`/${type}`)
  }

  /* edit profile displayName and description */
  toggleEdit = () => {
    this.setState({ isEditing: !this.state.isEditing })
    if( !this.setState.isEditing && this.state.user) {
      this.updateUserInfo()
    }
  }
  editDisplayName = (evt) => {
    evt.preventDefault()
    this.setState({ displayName: evt.target.value })
  }
  editDesc = (evt) => {
    evt.preventDefault()
    this.setState({ description: evt.target.value })
  }
  updateUserInfo = () => {
    firebase.database().ref('user').child(this.state.user.uid).child('description').set(this.state.description)
    firebase.database().ref('user').child(this.state.user.uid).child('username').set(this.state.displayName)
  }

  render() {
    const { user, storyBranches, unpublishedCards, favorites, bookmarks, usersFollowed, resolvedDrafts } = this.state
    let cardKeys = Object.keys(unpublishedCards)

    return (
      <div className="container-fluid user-profile" >
        {!user ?
          <h1>Please login to view your profile!</h1>
          :
          <div>
            <EditUserProfile user={user}
              toggleEdit={this.toggleEdit}
              displayName={this.state.displayName}
              description={this.state.description}
              isEditing={this.state.isEditing}
              editDisplayName={this.editDisplayName}
              editDesc={this.editDesc}
              updateUserInfo={this.updateUserInfo}/>
            <hr />
            <div className="row">
              <div className="col col-lg-6 col-md-6 col-sm-6">
                <h3>My Draft Scenes</h3>
                {_.isEmpty(unpublishedCards)
                  ? (<div>
                    <p>
                      It looks like you don't have any drafts.  Would you like to <Link to='/write'>write a story</Link>?
                    </p>
                    </div>)
                  : (<div className="row" >
                    <ul className="no-bullets">
                    {resolvedDrafts.map((draft, index) => (
                      <li key={draft}><Link to={`/write/${cardKeys[index]}`}>{draft}</Link></li>
                    ))}
                    </ul>
                    </div>)
                }
              </div>

              <div className="col col-lg-6 col-md-6 col-sm-6">
                <h3>Bookmarks</h3>
                {_.isEmpty(bookmarks)
                  ? (<div>
                    <p>
                      It looks like you don't have any bookmarks!
                    </p>
                    </div>)
                  : (<div className="row" >
                    <ul className="no-bullets">
                    {Object.keys(bookmarks).map(branchKey => {
                      let card = bookmarks[branchKey]
                      return <li key={branchKey}><Link to={`/read/${branchKey}/${card}`}>{branchKey}</Link></li>
                    })}
                    </ul>
                    </div>)
                }
              </div>
            </div>

            <hr />

            <h3 className="sub-header-profile">Favorited Stories</h3>
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
            <hr />
            <h3 className="sub-header-profile">Users You're Following</h3>
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
            <div className="row users-following" >
              <AllUsers
                filtered={true}
                userId={this.state.user.uid}
                followedUsers={this.state.usersFollowed}/>
            </div>
          }
          <hr />

          <h3 className="sub-header-profile">Your Story Branches</h3>
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

          </div>
        } {/* end check to see if user is logged in */}
        <br />
        <br />
      </div>
    )
  }
}
