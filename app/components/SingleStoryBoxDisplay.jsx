// react
import React, { Component } from 'react'

// material ui
import {Card, CardMedia, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

// firebase
import firebase from 'app/fire'
const auth = firebase.auth()

// material ui components for favorites
import Checkbox from 'material-ui/Checkbox'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border'

// link from react-router-dom
import {Link} from 'react-router-dom'

//libraries
import _ from 'lodash'

//utils
import { isOwnBranch } from '../utils/singleStoryBox.js'

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
      isMyStory: false
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
        this.favesListener = firebase.database().ref(`user/${user.uid}/faves/${this.props.thisKey}`)
        this.favesListener.on('value', snap => {
          const val = snap.val()
          if( val !== null ) this.setState({checked: val})
        })
        isOwnBranch(user.uid,this.props.storyBranchTitle)
        .then(bool => {
          this.setState({isMyStory: bool})
        })
      }
    })) // end on AuthStateChanged

  }

  componentWillUnmount() {
    if (this.favesListener) this.favesListener.off()
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
      // adds story when favorited
      firebase.database().ref('user').child(this.state.userId).child('faves').child(storyKey).set(true)
    } else {
      // removes story when un-favorited
      firebase.database().ref('user').child(this.state.userId).child('faves').child(storyKey).remove()
    }
  }

  render() {
    const {storyBranchTitle, storyBranchDetails, thisKey} = this.props
    
    const getStoryRootTitle = () => {
      const roots = _.isEmpty(storyBranchDetails) ? [] : storyBranchDetails.storyRoot
      return roots.length > 1 ? roots[roots.length - 1] : storyBranchTitle
    }

    return (
    <Card className="single-card col-lg-4 col-md-4 col-sm-6"
          style={{boxShadow: "none", outlineStyle:"dashed", outlineColor:"#EDE2D4"}}>
      <CardHeader>
        <Checkbox
          checkedIcon={<ActionFavorite style={{color: '#FFB6C1'}} />}
          uncheckedIcon={<ActionFavoriteBorder />}
          checked={this.state.checked}
          onCheck={this.updateCheck.bind(this)}
        />
      </CardHeader>
      <Link key={thisKey} to={`/read/${thisKey}`}>
        <CardTitle title={storyBranchTitle} subtitle={getStoryRootTitle()} />
        <CardText>
          No description available
        </CardText>
      </Link>
      {this.state.isMyStory ? <h1>mineee</h1>: null}
    </Card>
    )
  }
}
