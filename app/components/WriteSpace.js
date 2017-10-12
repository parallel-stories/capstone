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

//firebase
import firebase from 'app/fire'
const auth = firebase.auth()

import { dialogStyle } from '../stylesheets/MatUIStyle'

import { saveCard, publishCard } from '../utils/write.js'
import history from '../history'

import _ from 'lodash'

export default class WriteSpace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      openSubmit: false,
      dirtyText: false,
      dirtyTitle: false,
      editTitle: true,
      titleIsPub: false,
      openUnauthPopUp: true,
      // saveCard & publishCard depend on the state below not being refactored
      cardId: '',
      card: {
        branchTitle: '',
        branchDesc: '',
        branches: {},
        nextCard: '',
        prevCard: '',
        published: false,
        rootTitle: ['isRoot'],
        text: '',
        userId: ''
      },
      // end saveCard & publishCard needs
      openPrevCard: false,
      prevCardText: ''
      // TODO: implement warnings
      // to check for inputs -- can't be blank
      // and can't be more than 500 characters
    }
  }

  componentDidMount() {
    // set user
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }, () => {
      if (user) {
        this.setState({
          card: Object.assign({}, this.state.card, {
            userId: user.uid
          })
        })
      }
    }))

    // set state based on url
    if (this.props.isBranch) { // if branching
      firebase.database().ref(`storyCard/${this.props.match.params.cardId}`).once('value', snap => {
        // get root title array of root card from firebase
        this.setState({
          prevCardText: snap.val().text,
          card: Object.assign({}, this.state.card, {
            rootTitle: [...snap.val().rootTitle, snap.val().branchTitle],
            prevCard: this.props.match.params.cardId
          })
        })
      })
    } else if (this.props.match.params.storyBranch) { // if continuing published storyline
      const storyBranchId = decodeURI(this.props.match.params.storyBranch)
      firebase.database().ref(`storyBranch/${storyBranchId}`).once('value', snap => {
        // check if title is published to allow/prevent editing
        const titleIsPub = (snap.val().published)
        const lastStoryCardId = snap.val().storyCards[snap.val().storyCards.length - 1]
        firebase.database().ref(`storyCard/${lastStoryCardId}`).once('value', cardSnap => {
          if (cardSnap.val().userId == this.state.user.uid) {
            this.setState({
              prevCardText: cardSnap.val().text,
              titleIsPub: titleIsPub,
              card: Object.assign({}, this.state.card, {
                branchTitle: storyBranchId,
                prevCard: lastStoryCardId,
                rootTitle: cardSnap.val().rootTitle,
                userId: cardSnap.val().userId
              })
            })
          } else history.push(`/read/${this.props.match.params.storyBranch}`)
        })
      })
    } else if (this.props.match.params.cardId) { // if editing saved card
      firebase.database().ref(`storyCard/${this.props.match.params.cardId}`).once('value', snap => {
        if (snap.val().userId == this.state.user.uid) {
          if (!snap.val().published) {
            // check if title is published to allow/prevent editing
            firebase.database().ref(`storyBranch/${snap.val().branchTitle}`).once('value', branchSnap => {
              const titleIsPub = (branchSnap.val().published)
              this.setState({
                titleIsPub: titleIsPub,
                cardId: this.props.match.params.cardId,
                card: snap.val()
              })
            })
            // get prev card text
            firebase.database().ref(`storyCard/${snap.val().prevCard}/text`).once('value', snap => {
              this.setState({
                prevCardText: snap.val()
              })
            })
          } else {
            history.push(`/read/${snap.val().branchTitle}/${this.state.cardId}`)
          }
        } else history.push('/404')
      })
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  changeStoryText = (value) => {
    this.setState({
      dirtyText: true,
      card: Object.assign({}, this.state.card, {text: value})
    })
  }

  changeBranchTitle = (evt) => {
    this.setState({
      dirtyText: true,
      card: Object.assign({}, this.state.card, {branchTitle: evt.target.value})
    })
  }

  changeBranchDesc = (evt) => {
    this.setState({
      dirtyText: true,
      card: Object.assign({}, this.state.card, {branchDesc: evt.target.value})
    })
  }

  // change Title from H2 to Input field
  editTitle = () => {
    this.setState({
      editTitle: true
    })
  }

  saveTitle = () => {
    saveCard(this.state.card, this.state.cardId) // imported from functions folder. returns card ID
    .then(cardKey => {
      this.setState({
        editTitle: false,
        cardId: cardKey
      })
      history.push(`/write/${cardKey}`)
    })
  }

  // clear story and submit story handlers
  clearStory = () => {
    this.setState({
      card: Object.assign({}, this.state.card, {text: ''})
    })
  }

  saveStory = (evt) => {
    evt.preventDefault()

    if (this.state.card.branchTitle == '') {
      alert('Please give your story a title.')
    } else if (this.state.card.text == '') {
      alert('Please write some text.')
    } else {
      saveCard(this.state.card, this.state.cardId) // imported from functions folder. returns card ID
      .then(cardKey => {
        this.setState({
          dirtyText: false,
          dirtyTitle: false,
          editTitle: false,
          cardId: cardKey
        })
        history.push(`/write/${cardKey}`)
      })
    }
  }

  publishStory = (evt) => {
    evt.preventDefault()

    if (this.state.card.branchTitle == '') {
      alert('Please give your story a title.')
    } else if (this.state.card.text == '') {
      alert('Please write some text.')
    } else {
      return publishCard(this.state.card, this.state.cardId) // imported from functions folder. returns card ID
    }
  }

  publishAndContinue = (evt) => {
    this.publishStory(evt)
    .then(cardKey => {
      this.setState({
        openSubmit: false,
        dirtyText: false,
        dirtyTitle: false,
        editTitle: false,
        titleIsPub: true,
        cardId: '',
        card: Object.assign({}, this.state.card, {
          text: '',
          rootTitle: this.state.card.rootTitle != []
            ? this.state.card.rootTitle
            : [this.state.card.branchTitle],
          prevCard: cardKey,
          nextCard: ''
        })
      })
    })
  }

  publishAndRead = (evt) => {
    this.publishStory(evt)
    .then(cardKey => history.push(`/read/${this.state.card.branchTitle}/${cardKey}`))
  }

  // to open/close dialog box on submit story
  handleOpen = () => {
    if (this.state.card.branchTitle == '') {
      alert('Please give your story a title.')
    } else if (this.state.card.text == '') {
      alert('Please write some text.')
    } else {
      this.setState({openSubmit: true})
    }
  }
  handleClose = () => { this.setState({openSubmit: false}) }

  handlePrevCardOpen = () => this.setState({openPrevCard: true})

  handlePrevCardClose = () => this.setState({openPrevCard: false})

  handleUnauthPopUpClose = () => { this.setState({openUnauthPopUp: false}) }

  render() {
    // actions to submit/cancel story submission
    const actionsDialog = [
      <FlatButton key='cancel' label="Cancel" primary={true} onClick={this.handleClose} />,
      <FlatButton label="Publish Card & Continue Story" primary={true} keyboardFocused={true} onClick={this.publishAndContinue} />,
      <FlatButton label="Publish Card & Read Story" primary={true} keyboardFocused={true} onClick={this.publishAndRead} />
    ]

    const prevCardDialog = [
      <FlatButton key='close' label="Close" primary={true} onClick={this.handlePrevCardClose} />
    ]

    const unauthPopUpActions = [
      <FlatButton key='cancel' label="Cancel" primary={true} onClick={this.handleUnauthPopUpClose} />
    ]

    return (
      <div className="container container-fluid">
          {!this.state.user &&
            <Dialog
            title="Please Log In"
            actions={unauthPopUpActions}
            modal={false}
            open={this.state.openUnauthPopUp}
            onRequestClose={this.handleUnauthPopUpClose}
            contentStyle={dialogStyle}
            autoScrollBodyContent={true}
          > In order to write a story, you must log in using the button on the top right.
          </Dialog>
          }

        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12" style={{'height': '435px'}}>

            <div className="form-group container">
            {// if title is pub, don't allow title to be changed, otherwise allow editing based on state.editTitle status
              this.state.titleIsPub
              ? <div>
                  <h2>
                    {this.state.card.branchTitle}
                  </h2>
                  <span style={{lineHeight: '125%'}}>
                    {
                      (this.state.card.branchDesc != '')
                        && this.state.card.branchDesc
                    }
                  </span>
                </div>
              : !this.state.editTitle
                ? <div>
                    <h2>
                      {this.state.card.branchTitle}
                    </h2>
                    <span style={{lineHeight: '125%'}}>
                      {
                        (this.state.card.branchDesc != '')
                          && this.state.card.branchDesc
                      }
                    </span>
                  </div>
                : <div>
                    <h2>
                      <input type="text"
                        className="form-control"
                        value={this.state.card.branchTitle}
                        placeholder="Story Title"
                        id="titleField"
                        onChange={this.changeBranchTitle} />
                    </h2>
                    <span>
                      <input type="text"
                        style={{fontSize: '.75em', height: '75%', lineHeight: '75%'}}
                        className="form-control"
                        value={this.state.card.branchDesc}
                        placeholder="Story Description"
                        id="titleField"
                        onChange={this.changeBranchDesc} />
                    </span>
                  </div>
              }
              {
                (this.state.card.rootTitle.length > 1) && (
                  <div className="subtext" style={{float: 'right'}}>...A branch of <i>{this.state.card.rootTitle[this.state.card.rootTitle.length-1]}</i></div>
                )
              }

            <div className="subtext">
              {// if title is pub, no save/edit links should be displayed beneath title; otherwise display links based on state.editTitle status and if there is actually title text to save
              this.state.titleIsPub
              ? <Link to="#">
                  &nbsp;
                </Link>
              : !this.state.editTitle
                ? <Link to="#" onClick={this.editTitle}>
                    (edit title and description)
                  </Link>
                : (this.state.card.branchTitle != '')
                  ? <Link to="#" onClick={this.saveTitle}>
                      (save title and description)
                    </Link>
                  : <Link to="#">
                      &nbsp;
                    </Link>
              }
              </div>
            </div>

            <ReactQuill value={this.state.card.text}
              onChange={this.changeStoryText}
              className="container container-fluid"
              style={{'height': '250px', 'marginBottom': '50px'}} />
          </div>
        </div>
        <br />
        <div className="container container-fluid">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <RaisedButton key='save'
                label="SAVE SCENE"
                backgroundColor="#D2B48C"
                style={{'marginRight': '10px'}}
                onClick={this.saveStory}
                disabled={!this.state.card.text.length} />
              <RaisedButton key='submit'
                label="PUBLISH SCENE"
                backgroundColor="#D2B48C"
                style={{'marginRight': '10px'}}
                onClick={this.handleOpen}
                disabled={!this.state.card.text.length} />
              <RaisedButton key='clear'
                label="CLEAR"
                backgroundColor="#B83939"
                onClick={this.clearStory}
                disabled={!this.state.card.text.length} />
              <RaisedButton key='prevcard'
                label="VIEW PREV CARD"
                backgroundColor="#FAFBF6"
                onClick={this.handlePrevCardOpen}
                disabled={!this.state.card.prevCard}
                style={{float: 'right'}} />
            </div>
          </div>
        </div>
        <br />
        <br />
        <Dialog
          title="Submit a New Story"
          actions={actionsDialog}
          modal={false}
          open={this.state.openSubmit}
          onRequestClose={this.handleClose}
          contentStyle={dialogStyle}
          autoScrollBodyContent={true}
        >
          <form onSubmit={this.publishAndRead} />
          <h2>{this.state.card.branchTitle}</h2>
          { ReactHtmlParser(this.state.card.text) }
        </Dialog>
        <Dialog
          title="(Previous Card)"
          actions={prevCardDialog}
          modal={false}
          open={this.state.openPrevCard}
          onRequestClose={this.handlePrevCardClose}
          contentStyle={dialogStyle}
          autoScrollBodyContent={true}
        >
        {ReactHtmlParser(this.state.prevCardText)}
        </Dialog>
        </div>
    )
  }
}
