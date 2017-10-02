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
            //
          }
        </CardText>
        <CardActions>
        {
          this.props.branches &&
          Object.keys(this.props.branches).map((branch) => <FlatButton key={branch} label={`${branch}`} onClick={() => console.log('clicked branch')} />)
        }
        </CardActions>
      </Card>
    )
  }
}
