// react
import React, { Component } from 'react'

// material ui
import {Card, CardMedia, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

// firebase
import firebase from 'app/fire'
import 'firebase/database'
const auth = firebase.auth()

// material ui components for favorites
import Checkbox from 'material-ui/Checkbox'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border'

// link from react-router-dom
import {Link} from 'react-router-dom'

const styles = {
  card: {
    boxShadow: "none",
  },
};

export default class SingleStoryBoxDisplay extends Component {
  constructor() {
    super()
    this.state = {
      checked: false,
      loggedIn: false,
      userId: '',
    }
  }

  componentDidMount() {
    // check to see if a user favorited this story
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }, () => {
      if( user ) {
        this.setState({
          loggedIn: true,
          userId: user.uid,
        })
      }
    }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  updateCheck() {
    this.setState((oldState) => {
      return {
        checked: !oldState.checked,
      }
    })
    this.updateUserPref()
  }

  updateUserPref = () => {
    const storyKey = this.props.thisKey
    if( !this.state.checked ) {
      console.log('adding a favorite!')
      firebase.database().ref('user').child(this.state.userId).child('faves').child(storyKey).set(true)
    } else {
      console.log('removed a fave :(')
      firebase.database().ref('user').child(this.state.userId).child('faves').child(storyKey).remove()
    }
  }

  render() {
    const {storyBranchTitle, storyBranchDetails, thisKey} = this.props

    return (
    <Card className="single-card col-lg-4 col-md-4 col-sm-4"
          style={{boxShadow:"none", borderWidth: 1}}>
      <CardHeader>
        <Checkbox
          checkedIcon={<ActionFavorite style={{color: '#FFB6C1'}} />}
          uncheckedIcon={<ActionFavoriteBorder />}
          checked={this.state.checked}
          onCheck={this.updateCheck.bind(this)}
        />
      </CardHeader>
      <Link key={thisKey} to={`/read/story_branch/${thisKey}`}>
        <CardMedia
          overlay={<CardTitle title={storyBranchTitle} subtitle={storyBranchDetails.storyRoot} />}
        >
          <img src="images/book_icon.svg" alt="" />
        </CardMedia>
        <CardText>
          No description available
        </CardText>
      </Link>
    </Card>
    )
  }
}
