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

import { dialogStyle } from '../stylesheets/MatUIStyle'

import { saveCard, publishCard } from './functions/write.js'

export default class WriteSpace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openSubmit: false,
      dirtyText: false,
      // saveCard & publishCard depend on the state below not changing
      cardId: this.props.cardId || '',
      card: {
        userId: 1,
        text: '',
        branchTitle: 'House of Leaves',
        rootTitle: this.props.rootTitle || '',
        prevCard: this.props.prevCard || '',
        nextCard: this.props.nextCard || ''
      }
      // TODO: implement warnings
      // to check for inputs -- can't be blank
      // and can't be more than 500 characters
    }
    this.changeStoryText = this.changeStoryText.bind(this)

    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.saveStory = this.saveStory.bind(this)
    this.publishStory = this.publishStory.bind(this)
    this.clearStory = this.clearStory.bind(this)
  }

  componentDidMount() {
    if (this.props.cardId) {
      firebase.database().ref('storyCard').child(this.props.cardId).on('value', snap => {
        if (!snap.val().published) {
          this.setState({card: snap.val()})
        } else {
          this.setState({
            card: {
              text: 'This card has already been published.'
            }
          })
        }
      })
    }
  }

  changeStoryText(value) {
    this.setState({
      dirtyText: true,
      card: Object.assign({}, this.state.card, {text: value})
    })
  }

  // clear story and submit story handlers
  clearStory = () => {
    this.setState({card: {text: ''}})
  }

  saveStory(evt) {
    evt.preventDefault()

    const cardKey = saveCard(this.state.card, this.state.cardId) // imported from functions folder. returns card ID

    this.setState({
      cardId: cardKey,
      dirtyText: false,
      dirtyTitle: false
    })
  }

  publishStory(evt) {
    evt.preventDefault()

    const cardKey = publishCard(this.state.card, this.state.cardId) // imported from functions folder. returns card ID

    this.setState({
      openSubmit: false,
      dirtyText: false,
      dirtyTitle: false,
      cardId: '',
      card: Object.assign({}, this.state.card, {
        userId: 1,
        text: '',
        prevCard: cardKey,
        nextCard: ''
      })
    })
  }

  // to open/close dialog box on sumit story
  handleOpen = () => { this.setState({openSubmit: true}) }
  handleClose = () => { this.setState({openSubmit: false}) }

  render() {
    // actions to submit/cancel story submission
    const actionsDialog = [
      <FlatButton key='cancel' label="Cancel" primary={true} onClick={this.handleClose} />,
      <FlatButton key='submit' label="Publish Card & Continue Story" primary={true} keyboardFocused={true} onClick={this.publishStory} />,
    ]

    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
          Root Title: {this.state.card.rootTitle}<br />
          Branch Title: {this.state.card.branchTitle}<br />
            <ReactQuill value={this.state.card.text}
              onChange={this.changeStoryText}
              className="container container-fluid" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="form-group container floatLeft">
              <RaisedButton key='save'
                label="SAVE CARD"
                backgroundColor="#D2B48C"
                onClick={this.saveStory}
                disabled={!this.state.card.text.length} />
              <RaisedButton key='submit'
                label="PUBLISH CARD & CONTINUE STORY"
                backgroundColor="#D2B48C"
                onClick={this.handleOpen}
                disabled={!this.state.card.text.length} />
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
          <form onSubmit={this.publishStory} />
          { ReactHtmlParser(this.state.card.text) }
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

// <div className="form-group container">
// <input type="text"
//   className="form-control"
//   value={this.state.title}
//   placeholder="Story Title"
//   id="titleField"
//   onChange={this.changeTitle} />
// </div>
