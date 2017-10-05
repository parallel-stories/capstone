import React, { Component } from 'react'
import {Link} from 'react-router-dom'

// material ui
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Snackbar from 'material-ui/Snackbar'

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
              to={`/read/story_branch/${branch}/${currentCardId}`}
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

  render() {
    const {handleReturnToPrevBranch} = this.props
    const {currentCard, currentStoryBranchId} = this.props.currentState
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
        <CardActions>
          <FlatButton label="Branch" />
          {
            branches.length &&
            (
              <div>
                <FlatButton label="Read Branches" onClick={this.handleDownClick} />
                {
                  getDialogBox(
                    'Choose another story branch:',
                    branches,
                    getCancelAlertButton(() => this.setState({isReadingBranchOptions: false})),
                    isReadingBranchOptions, true
                  )
                }
              </div>
            )
          }
          {
            parentCardId &&
            (
              <div>
                <Link to={`/read/story_branch/${parentBranchId}/${parentCardId}`}>
                  <FlatButton label="Return to previous story branch" onClick={handleReturnToPrevBranch}/>
                </Link>
              </div>
            )
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
