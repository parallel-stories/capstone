import React, { Component } from 'react'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

export default class SingleCard extends Component {
  render() {
    return (
      <Card>
        <CardTitle title=""/>
        <CardText>
          {
            this.props.currentCard &&
            this.props.currentCard.text
          }
        </CardText>
        <CardActions>
          <FlatButton label="Branch" />
        </CardActions>
      </Card>
    )
  } // end return
}
