import React, { Component } from 'react'
import {Link} from 'react-router-dom'

// material ui
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Snackbar from 'material-ui/Snackbar'
import Divider from 'material-ui/Divider'

// html parser
import ReactHtmlParser from 'react-html-parser'

// utils
import {getDialogBox, getCancelAlertButton} from '../utils/storyBranchNavUtils'

export default class SingleCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isReadingBranchOptions: false,
      isChangingBranch: false
    }
  }

  handleDownClick = () => this.setState({isReadingBranchOptions: true})

  getBranchOptions = () => {
    const branchLinks = []
    const {currentCard, currentStoryBranchId, currentCardId} = this.props.currentState
    const {parentBranchId, parentCardId} = this.props.parent

    if (currentCard.branches) {
      Object.keys(currentCard.branches).forEach(branch => {
        if (branch !== currentStoryBranchId && branch !== parentBranchId) {
          branchLinks.push(
            <Link
              key="branch"
              to={`/read/${branch}/${currentCardId}`}
              onClick={() => {
                this.setState({isReadingBranchOptions: false, isChangingBranch: true})
                this.props.handleOptionClick()
              }}>
              {branch}
            </Link>
          )
        }
      })
    }
    return branchLinks
  }

  getButton = (valCheck, label, bkColor, callback) => {
    if (valCheck) {
      return <FlatButton label={label} backgroundColor={bkColor} onClick={callback} />
    }
  }

  getPrevButton = (parentCardId, parentBranchId) => {
    if (parentCardId) {
      return (
        <Link to={`/read/story_branch/${parentBranchId}/${parentCardId}`}>
        {
          this.getButton(parentCardId, 'Return to previous story branch', '#50AD55', this.props.handleReturnToPrevBranch)
        }
        </Link>
      )
    }
  }

  getBranchingButton = (rootId, cardId) => {
    return (
      <Link to={`/write/${rootId}/${cardId}/new_branch`}>
        <FlatButton label='Create A Branch' backgroundColor='#D1B38E' />
      </Link>
    )
  }

  render() {
    const {handleReturnToPrevBranch} = this.props
    const {currentCard, currentStoryBranchId, currentCardId} = this.props.currentState
    const {parentBranchId, parentCardId} = this.props.parent
    const {isReadingBranchOptions, isChangingBranch} = this.state
    const branches = this.getBranchOptions()

    return (
      <Card>
        <CardTitle title=""/>
        <CardText>
          {
            currentCard
            ? ReactHtmlParser(currentCard.text)
            : <div></div>
          }
        </CardText>
        <Divider />
        <CardActions>
          {
            this.getBranchingButton(currentStoryBranchId, currentCardId)
          }
          {
            this.getButton(branches.length, 'Read Branches', '#50AD55', this.handleDownClick)
          }
          {
            getDialogBox(
              'Choose another story branch:',
              branches,
              getCancelAlertButton(() => this.setState({isReadingBranchOptions: false})),
              isReadingBranchOptions, true
            )
          }
          {
            this.getPrevButton(parentCardId, parentBranchId)
          }
          <Snackbar
            open={this.state.isChangingBranch}
            message={`You are now on story branch "${currentStoryBranchId}"`}
            autoHideDuration={2000}
          />
        </CardActions>
      </Card>
    )
  }
}
