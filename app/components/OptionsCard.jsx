import React, { Component } from 'react'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

export default class OptionsCard extends Component {
  render() {
    return (
      <Card>
        <CardTitle title="Choose another story branch:"/>
        <CardText>
          {
            this.props.branches &&
            // OB/FF: consider reformatting this code
            Object.keys(this.props.branches).map((branch) => <button key={branch} onClick={(evt) => this.props.handleOptionClick(branch)}>{branch}</button>)
           // Object.keys(this.props.branches).map((branch) => <p key={branch} onClick={() => console.log('clicked branch')}>{branch}</p>)
          }
        </CardText>
        <CardActions>
        {
          // OB/FF: this could be in an issue?
          // maybe button to exit branching and read original story branch
          // this.props.branches &&
          // Object.keys(this.props.branches).map((branch) => <FlatButton key={branch} label={`${branch}`} onClick={() => console.log('clicked branch')} />)
        }
        </CardActions>
      </Card>
    )
  }
}
