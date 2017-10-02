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

import {makeCommunity, makeCard} from '../reducers'
import {connect} from 'react-redux'
import firebase from 'app/fire'
import 'firebase/database'

const style = {
  margin: 10,
}

const dialogStyle = {
  width: '100%',
  maxWidth: 'none',
  height: '100%',
  maxHeight: 'none',
}

class WriteSpace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openSubmit: false,
      text: '',
      title: '',
      // TODO: implement warnings
      // to check for inputs -- can't be blank
      // and can't be more than 500 characters
      dirtyText: false,
      dirtyTitle: false,
    }
    this.changeStoryText = this.changeStoryText.bind(this)

    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.changeTitle = this.changeTitle.bind(this)

    this.submitStory = this.submitStory.bind(this)
    this.clearStory = this.clearStory.bind(this)
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

  submitStory(evt) {
    evt.preventDefault()

    const community = {
      title: this.state.title,
      description: this.state.text,
      stories: {}
    }

// only for creating a community NOT adding to story
    const story = {
      cards: {
        previousCard: null,
        text: this.state.text,
        title: this.state.title,
        userId: 'update this'
      }
    }

    this.props.makeCommunity(story, community)

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
      <FlatButton key='submit' label="Submit" primary={true} keyboardFocused={true} onClick={this.submitStory} />,
    ]

    const actionsStory = [
      <RaisedButton key='submit' label="SUBMIT A NEW STORY" backgroundColor="#D2B48C" style={style}
                    onClick={this.handleOpen} disabled={!this.state.text.length} />,
      <RaisedButton key='clear' label="CLEAR ALL" backgroundColor="#B83939" style={style}
                    onClick={this.clearStory} />,
    ]

    return (
      <div>
        <ReactQuill value={this.state.text}
                    onChange={this.changeStoryText}
                    className="container container-fluid"/>
        <div className="row">
          <div className="col col-4 col-lg-4 col-md-4 col-sm-4">
            { actionsStory }
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
          <form onSubmit={this.submitStory}>
            <TextField
              hintText="Name Your Story Line"
              floatingLabelText="Title"
              name="title"
              fullWidth={true}
              multiLine={true}
              onChange={this.changeTitle}
            />
          </form>
          { ReactHtmlParser(this.state.text) }
        </Dialog>
      </div>
    )
  }
}

export default connect(null, {makeCommunity, makeCard})(WriteSpace)
