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

class BranchStepper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stepIndex: 0,
      branchId: '',
      cardId: ''
    }
  }

  componentDidMount() {
    console.log('MOUNTING STEPPER')
    // console.log('MMOUNT:', this.props.match.params)
    this.setState({
      branchId: this.props.match.params.branchId,
      cardId: this.props.match.params.cardId
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log('STEPPER NEXT PROPS:', nextProps)
    this.setState({
      branchId: nextProps.match.params.branchId,
      cardId: nextProps.match.params.cardId
    })
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

  render() {
    const {stepIndex} = this.state
    console.log('STEPPER STATE:', this.state)

    return (
      <div style={{maxWidth: 1000, maxHeight: 400, margin: 'auto'}}>
        <Stepper
          activeStep={stepIndex}
          linear={false}
          orientation="vertical"
        >
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 0})}>
              Select campaign settings
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
        </Stepper>
      </div>
    )
  }
}

export default BranchStepper
