// import react stuff here
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// material ui
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

// firebase
import firebase from 'app/fire'
import 'firebase/database'

export default class UserCard extends Component {
  constructor() {
    super()
    this.state = {
      fullName: 'unknown',
      following: false,
      storiesAuthored: 0,
    }
  }

  componentDidMount() {
    firebase.database().ref().child('user').child(this.props.currentUser.uid).once('value', snap => {
        const following = snap.val()
        if( following !== null ) this.setState({ following })
    })
  }

  componentWillUnmount() {
    if( this.followingListener ) this.followingListener.off()
  }

  updateFollowing = () => {
    this.setState((oldState) => {
      return {
        following: !oldState.following,
      }
    })
    this.updateUserFollow()
  }

  updateUserFollow = () => {
    const userKey = this.props.thisKey
    this.followingListener = firebase.database().ref('user').child(this.props.currentUser.uid).child('following').child(userKey)
    if( !this.state.following ) {
      // adds story when favorited
      this.followingListener.set(true)
    } else {
      // removes story when un-favorited
      this.followingListener.remove()
    }
  }

  render() {
    const { thisKey } = this.props
    console.log("WHAT IS PROPS ON THE ALL USERS PAGE", this.props.user, this.props.thisKey)
    return (
      <Card className="single-card col-lg-4 col-md-4 col-sm-4">
        <Link to={`/allUsers/${thisKey}`} key={thisKey}>
          <CardHeader
            title={`${this.state.fullName}`}
            subtitle={`${this.state.storiesAuthored}`}
            avatar="http://via.placeholder.com/150x150"
            />
          <CardText>
            User description will go here
          </CardText>
        </Link>
        <CardActions>
          <FloatingActionButton mini={true}
            style={{marginRight: 20, boxShadow: "none"}}
            onClick={ this.updateFollowing } >
            <ContentAdd />
          </FloatingActionButton>
        </CardActions>
        <br />
      </Card>
    )
  }
}
