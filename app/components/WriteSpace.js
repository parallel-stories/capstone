import React, { Component } from 'react'

// quill
import ReactQuill from 'react-quill'

// html parser
import ReactHtmlParser from 'react-html-parser'

// material ui dialog box to submit story
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'

import firebase from 'app/fire'
import 'firebase/database'

import {dialogStyle} from '../stylesheets/MatUIStyle'

export default class WriteSpace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: 1,
      openSubmit: false,
      text: '',
      title: '',
      dbTitle: '',
      cardId: '1',
      // TODO: implement warnings
      // to check for inputs -- can't be blank
      // and can't be more than 500 characters
      dirtyText: false,
      dirtyTitle: false,
    }
    this.changeStoryText = this.changeStoryText.bind(this)
    this.changeTitle = this.changeTitle.bind(this)

    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.saveStory = this.saveStory.bind(this)
    this.publishStory = this.publishStory.bind(this)
    this.clearStory = this.clearStory.bind(this)
  }

  componentDidMount() {
    if (this.state.cardId) {
      firebase.database().ref('storyCard').child(this.state.cardId).on('value', snap => {
        if (!snap.val().published) {
          this.setState({
            text: snap.val().text,
            title: snap.val().branchTitle,
            dbTitle: snap.val().branchTitle
          })
        } else {
          this.setState({
            text: 'This card has already been published.'
          })
        }
      })
    }
  }

  changeStoryText(value) {
    this.setState({
      text: value,
      dirtyText: true
    })
  }

  changeTitle(evt) {
    this.setState({
      title: evt.target.value,
      dirtyTitle: true
    })
  }

  // clear story and submit story handlers
  clearStory = () => { this.setState({text: ''}) }

  saveStory(evt) {
    evt.preventDefault()

    const card = {
      previousCard: '',
      nextCard: '',
      text: this.state.text,
      branchTitle: this.state.title
    }

    if (this.state.cardId == null) {
      const cardKey = firebase.database().ref('storyCard').push(card).key

      const branch = {
        storyCards: [cardKey],
        storyRoot: this.state.title
      }

      const root = {}
      root[this.state.title] = true

      firebase.database().ref('storyBranch').child(this.state.title).set(branch)
      firebase.database().ref('storyRoot').child(this.state.title).set(root)
      firebase.database().ref('user').child(this.state.userId).child('storyBranches').child(this.state.title).set(true)
      firebase.database().ref('user').child(this.state.userId).child('storyBranches').child('unpublished').child(this.state.title).set(true)

      this.setState({cardId: cardKey})
    } else {
      firebase.database().ref('storyCard').child(this.state.cardId).update(card)
      if (this.state.title !== this.state.dbTitle) {
        firebase.database().ref('storyBranch').child(this.state.dbTitle).once('value')
        .then(snap => {
          const data = snap.val()
          data['storyRoot'] = this.state.title
          firebase.database().ref('storyBranch').child(this.state.dbTitle).set(null)
          return firebase.database().ref('storyBranch').child(this.state.title).set(data)
        })
        // firebase.database().ref('storyBranch').child(this.state.title).set(branch)
        // firebase.database().ref('storyRoot').child(this.state.title).set(root)
        // firebase.database().ref('user').child(this.state.userId).child('storyBranches').child(this.state.title).set(true)
        // firebase.database().ref('user').child(this.state.userId).child('storyBranches').child('unpublished').child(this.state.title).set(true)
        // LOOK INTO BULK UPDATE
      }
    }
  }

  publishStory(evt) {
    evt.preventDefault()

    const card = {
      previousCard: '',
      nextCard: '',
      text: this.state.text,
      published: true
    }

    const cardKey = firebase.database().ref('storyCard').push(card).key

    const branch = {
      storyCards: [cardKey],
      storyRoot: this.state.title
    }

    const root = {}
    root[this.state.title] = true

    firebase.database().ref('storyBranch').child(this.state.title).set(branch)
    firebase.database().ref('storyRoot').child(this.state.title).set(root)

    this.setState({
      openSubmit: false,
      text: '',
      title: '',
      dirtyText: false,
      dirtyTitle: false,
    })
  }

  // to open/close dialog box on sumit story
  handleOpen = () => { this.setState({openSubmit: true}) }
  handleClose = () => { this.setState({openSubmit: false}) }

  render() {
    // actions to submit/cancel story submission
    const actionsDialog = [
      <FlatButton key='cancel' label="Cancel" primary={true} onClick={this.handleClose} />,
      <FlatButton key='submit' label="Publish" primary={true} keyboardFocused={true} onClick={this.publishStory} />,
    ]

    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="form-group container">
              <input type="text"
                className="form-control"
                value={this.state.title}
                placeholder="Story Title"
                id="titleField"
                onChange={this.changeTitle} />
            </div>
            <ReactQuill value={this.state.text}
              onChange={this.changeStoryText}
              className="container container-fluid" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="form-group container floatLeft">
              <RaisedButton key='save'
                label="SAVE"
                backgroundColor="#D2B48C"
                onClick={this.saveStory}
                disabled={!this.state.text.length} />
              <RaisedButton key='submit'
                label="PUBLISH"
                backgroundColor="#D2B48C"
                onClick={this.handleOpen}
                disabled={!this.state.text.length} />
              <RaisedButton key='clear'
                label="CLEAR"
                backgroundColor="#B83939"
                onClick={this.clearStory} />
            </div>
          </div>
        </div>
        <Dialog
          title="Submit a New Story"
          actions={actionsDialog}
          modal={false}
          open={this.state.openSubmit}
          onRequestClose={this.handleClose}
          contentStyle={dialogStyle}
          autoScrollBodyContent={true}
        >
          <form onSubmit={this.publishStory}>

          </form>
          { ReactHtmlParser(this.state.text) }
        </Dialog>
      </div>
    )
  }
}


// <TextField
// hintText="Name Your Story Line"
// floatingLabelText="Title"
// name="title"
// fullWidth={true}
// multiLine={true}
// onChange={this.changeTitle}
// />
