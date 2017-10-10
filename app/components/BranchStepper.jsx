// react
import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import history from '../history'

// components
import SingleCard from './SingleCard'
import StoryBranchNav from './StoryBranchNav'

// material-ui
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

// utils
import {getStoryBranch, getStoryCard, getDialogBox, getCancelAlertButton} from '../utils/storyBranchNavUtils'

class BranchStepper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stepIndex: 0,
      branches: []
    }
  }

  componentDidMount() {
    const {branchId, cardId} = this.props.match.params
    getStoryBranch(branchId)
    .then(info => {
      this.setState({
        branches: [{...info.val(), branchId, cardId, branchingPointIndex: 0}]
      })
    })
  }

  branchAlreadyRead = (branchId) => {
    return this.state.branches.some(branch => {
      console.log('ALREADY EXISTS:', branchId, branch.branchId)
      return branch.branchId === branchId
    })
  }

  componentWillReceiveProps(nextProps) {
    const {branchId, cardId} = nextProps.match.params
    const {branches, stepIndex} = this.state
    const currentBranch = branches[stepIndex]
    if (branchId === currentBranch.branchId) {
      console.log('SAME BRANCH')
      currentBranch.cardId = cardId
      branches[stepIndex] = currentBranch
      this.setState({branches})
    } else if (!this.branchAlreadyRead(branchId)) {
      console.log('DIFFS BRANCH')
      getStoryBranch(branchId)
      .then(info => {
        const newBranch = info.val()
        newBranch.cardId = cardId
        newBranch.branchId = branchId
        newBranch.branchingPointIndex = newBranch.storyCards.indexOf(cardId)
        console.log('NEW BRANCH:', newBranch)
        this.setState({
          stepIndex: stepIndex + 1,
          branches: [...(branches.slice(0, stepIndex + 1)), newBranch]
        })
      })
    }
  }

  handleNext = () => {
    const {stepIndex} = this.state
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1})
    }
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1})
    }
  }

  renderStepActions(step) {
    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onClick={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onClick={this.handlePrev}
          />
        )}
      </div>
    )
  }

  renderBranch = (stepInd, branchId, cardId, branchingPointIndex) => {
    return (
      <Step key={stepInd}>
        <StepButton onClick={() => {
          this.setState({stepIndex: stepInd})
          history.push(`/read/story_branch/${branchId}/${cardId}`)
        }}>
          {
            stepInd === 0
            ? branchId
            : `BRANCH OFF TO >> ${branchId}`
          }
        </StepButton>
        <StepContent>
          <StoryBranchNav
            branchId={branchId}
            cardId={cardId}
            branchingPointIndex={branchingPointIndex}
          />
          {this.renderStepActions(stepInd)}
        </StepContent>
      </Step>
    )
  }

  render() {
    const {stepIndex, branches} = this.state
    console.log('STEPPER STATE:', this.state)

    return (
      <div style={{maxWidth: 1000, maxHeight: 400, margin: 'auto'}}>
        <Stepper
            activeStep={stepIndex}
            linear={false}
            orientation="vertical"
          >
          {
            branches.map((branch, ind) => this.renderBranch(ind, branch.branchId, branch.cardId, branch.branchingPointIndex, branch.currentCardId))
          }
        </Stepper>
      </div>
    )
  }
}

export default BranchStepper
