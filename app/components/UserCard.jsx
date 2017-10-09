// import react stuff here
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// material ui
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FlatButton from 'material-ui/FlatButton'

// firebase
import firebase from 'app/fire'
import 'firebase/database'

export default class UserCard extends Component {
  constructor() {
    super()
    this.state = {
      fullName: 'unknown',
      following: false,
      storiesAuthored: {},
    }
  }

  componentDidMount() {
    this.followListener = firebase.database().ref(`user/${this.props.currentUser.uid}/following/${this.props.thisKey}`)
    this.followListener.on('value', snap => {
      const val = snap.val()
      if( val ) this.setState({following: val})
    })
  }

  componentWillUnmount() {
    if( this.followListener ) this.followListener.off()
  }

  updateFollowing = () => {
    if( this.props.thisKey === this.props.currentUser.uid ) {
      alert('You can\'t follow yourself!')
    } else if( this.props.currentUser ) {
      this.setState((oldState) => {
        return {
          following: !oldState.following,
        }
      })
      this.updateUserFollow()
    } else {
      alert('Please Log In or Sign Up to Follow Users')
    }
  }

  updateUserFollow = () => {
    const userKey = this.props.thisKey
    if( !this.state.following ) {
      // adds story when favorited
      firebase.database().ref('user').child(this.props.currentUser.uid).child('following').child(userKey).set(true)
    } else {
      // removes story when un-favorited
      firebase.database().ref('user').child(this.props.currentUser.uid).child('following').child(userKey).remove()
    }
  }

  render() {
    const { thisKey } = this.props
    const numStoriesAuthored = Object.keys(this.props.user.storyBranches).length

    return (
      <Card
        className="single-card col-lg-4 col-md-4 col-sm-4"
        style={{boxShadow:"none", outlineStyle:"dashed", outlineColor:"#EDE2D4"}}>
        <Link to={`/allUsers/${thisKey}`} key={thisKey}>
          <CardHeader
            title={`${this.props.user.username}`}
            subtitle={`${numStoriesAuthored} stories authored`}
            />
          <CardText>
            <p>{this.props.user.description}</p>
          </CardText>
        </Link>
        <CardActions>
          <FloatingActionButton mini={true}
            style={{marginRight: 20, boxShadow: "none"}}
            onClick={ this.updateFollowing }
            secondary={ this.state.following }
            disabled={ this.props.thisKey===this.props.currentUser.uid }>
            <ContentAdd />
          </FloatingActionButton>
        </CardActions>
        <br />
      </Card>
    )
  }
}
