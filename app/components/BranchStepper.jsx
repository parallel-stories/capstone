// react
import React, { Component } from 'react'
import {Link} from 'react-router-dom'

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
import {getStoryBranch} from '../utils/storyBranchNavUtils'
import history from '../history'

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

  branchAlreadyRead = branchId => this.state.branches.some(branch => branch.branchId === branchId)

  componentWillReceiveProps(nextProps) {
    const {branchId, cardId} = nextProps.match.params
    const {branches, stepIndex} = this.state
    const currentBranch = branches[stepIndex]
    if (branchId === currentBranch.branchId) {
      currentBranch.cardId = cardId
      branches[stepIndex] = currentBranch
      this.setState({branches})
    } else if (!this.branchAlreadyRead(branchId)) {
      getStoryBranch(branchId)
      .then(info => {
        const newBranch = info.val()
        newBranch.cardId = cardId
        newBranch.branchId = branchId
        newBranch.branchingPointIndex = newBranch.storyCards.indexOf(cardId)
        this.setState({
          stepIndex: stepIndex + 1,
          branches: [...(branches.slice(0, stepIndex + 1)), newBranch]
        })
      })
    }
  }

  handleNext = () => {
    const {stepIndex} = this.state
    if (stepIndex < 2) this.setState({stepIndex: stepIndex + 1})
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    if (stepIndex > 0) this.setState({stepIndex: stepIndex - 1})
  }

  renderStepActions(step) {
    return (
      <div style={{margin: '12px 0'}}>
        {step > 0 && (
          <FlatButton
          label="Back"
          disableTouchRipple={true}
          disableFocusRipple={true}
          onClick={this.handlePrev}
          />
        )}
        {
          step < this.state.branches.length - 1 && (
          <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onClick={this.handleNext}
          style={{marginRight: 12}}
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
          history.push(`/read/${branchId}/${cardId}`)
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

    return (
      <div className="container" style={{maxWidth: 1000, margin: 'auto'}}>
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
