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
import {getStoryBranch, getStoryCard, getDialogBox, getCancelAlertButton} from '../utils/storyBranchNavUtils'

class BranchStepper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stepIndex: 0,
      branches: [],
     // branchIds: ''
    }
  }

  componentDidMount() {
    //console.log('MOUNTING STEPPER')
    const {branchId, cardId} = this.props.match.params
    getStoryBranch(branchId)
    .then(info => this.setState({
      branches: [{...info.val(), branchId, cardId}],
      branchIds: [branchId]
    }))
  }

  componentWillReceiveProps(nextProps) {
    const {branchId, cardId} = nextProps.match.params
    const {branches, stepIndex} = this.state
    const currentBranch = this.state.branches[this.state.stepIndex]
    if (branchId === currentBranch.branchId) {
      console.log('SAME BRANCH')
      currentBranch.cardId = nextProps.match.params.cardId
      branches[this.state.stepIndex] = currentBranch
      this.setState({branches})
    } else {
      console.log('DIFFS BRANCH')
      getStoryBranch(branchId)
      .then(info => {
        this.setState({stepIndex: this.state.stepIndex + 1, branches: [...(this.state.branches.slice(0, stepIndex + 1)), {...info.val(), branchId, cardId}]})
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

  renderBranches = (stepInd, branchId, cardId) => {
    return (
      <Step key={branchId}>
        <StepButton onClick={() => this.setState({stepIndex: stepInd})}>
          {
            stepInd === 0
            ? branchId
            : `Branched Off To: ${branchId}`
          }
        </StepButton>
        <StepContent>
            <StoryBranchNav branchId={branchId} cardId={cardId} />
          {this.renderStepActions(stepInd)}
        </StepContent>
      </Step>
    )
  }

  render() {
    const {stepIndex, branches} = this.state
    console.log('STEPPER STATE:', this.state)
    console.log('BRANCHES', branches)

    return (
      <div style={{maxWidth: 1000, maxHeight: 400, margin: 'auto'}}>
        <Stepper
          activeStep={stepIndex}
          linear={false}
          orientation="vertical"
        >
        {
          branches.map((branch, ind) => this.renderBranches(ind, branch.branchId, branch.cardId))
        }
        {/*
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 0})}>
              <p>Title: "{this.state.branchId}"</p>
            </StepButton>
            <StepContent>
              {
                this.state.branchId !== '' &&
                <StoryBranchNav branchId={this.state.branchId} cardId={this.state.cardId} />
              }
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
          <StepButton onClick={() => this.setState({stepIndex: 1})}>
              Create an ad group
            </StepButton>
            <StepContent>
              <p>An ad group contains one or more ads which target a shared set of keywords.</p>
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 2})}>
              Create an ad
            </StepButton>
            <StepContent>
              <p>
                Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.
              </p>
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
          */}
        </Stepper>
        {
          branches.length && <p>Where are you?</p>
        }
      </div>
    )
  }
}

export default BranchStepper
