import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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

import { saveCard, publishCard, saveBranchTitle } from './functions/write.js'

// OB/FF: consider splitting this up into a "state manager component" and a "presentational component"
export default class WriteSpace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openSubmit: false,
      dirtyText: false,
      dirtyTitle: false,
      editTitle: true,
      // saveCard & publishCard depend on the state below not changing
      cardId: '',
      card: {
        userId: 1,
        text: '',
        branchTitle: '',
        rootTitle: '',
        prevCard: '',
        nextCard: ''
      }
      // TODO: implement warnings
      // to check for inputs -- can't be blank
      // and can't be more than 500 characters
    }
    // OB/FF: class arrow functions
    this.changeStoryText = this.changeStoryText.bind(this)
    this.changeBranchTitle = this.changeBranchTitle.bind(this)

    this.editTitle = this.editTitle.bind(this)
    this.saveTitle = this.saveTitle.bind(this)

    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.saveStory = this.saveStory.bind(this)
    this.publishStory = this.publishStory.bind(this)
    this.clearStory = this.clearStory.bind(this)
  }

  componentDidMount() {
    if (this.props.cardId) {
      // OB/FF: could be `.once` (and/or stop listening later)
      firebase.database().ref('storyCard').child(this.props.cardId).on('value', snap => {
        if (!snap.val().published) {
          // OB/FF: consider sanitizing HTML at this point
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

  changeBranchTitle(evt) {
    this.setState({
      dirtyText: true,
      card: Object.assign({}, this.state.card, {branchTitle: evt.target.value})
    })
  }

  // change Title from H2 to Input field
  editTitle = () => {
    this.setState({
      editTitle: true
    })
  }

  saveTitle = () => {
    const cardKey = saveBranchTitle(this.state.card, this.state.cardId)
    this.setState({
      editTitle: false,
      cardId: cardKey
    })
  }

  // clear story and submit story handlers
  clearStory = () => {
    this.setState({
      card: Object.assign({}, this.state.card, {text: ''})
    })
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
          {
            this.state.editTitle
            ? <div className="form-group container">
                <h2>
                  <input type="text"
                    className="form-control"
                    value={this.state.card.branchTitle}
                    placeholder="Story Title"
                    id="titleField"
                    onChange={this.changeBranchTitle} />
                  </h2>
                <div className="subtext">
                  {
                    (this.state.card.branchTitle != '')
                    ? <Link to="#" onClick={this.saveTitle}>
                        (save title)
                      </Link>
                    : <Link to="#">
                        &nbsp;
                      </Link>
                  }
                </div>
              </div>
            : <div className="form-group container">
                <h2>{this.state.card.branchTitle}</h2>
                <div className="subtext">
                  <Link to="#" onClick={this.editTitle}>
                    (edit title)
                  </Link>
                </div>
              </div>
          }

          {
            (this.state.card.rootTitle != '') && (
              <div className="container">...A branch of <i>{this.state.card.rootTitle}</i></div>
            )
          }
            <ReactQuill value={this.state.card.text}
              onChange={this.changeStoryText}
              className="container container-fluid" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="form-group container floatLeft">
              {/* OB/FF: consider naming colors */}
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

// OB/FF: un-undead code?
// <TextField
// hintText="Name Your Story Line"
// floatingLabelText="Title"
// name="title"
// fullWidth={true}
// multiLine={true}
// onChange={this.changeTitle}
// />
