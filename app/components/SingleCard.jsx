import React, { Component } from 'react'

// material ui
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

// html parser
import ReactHtmlParser from 'react-html-parser'

export default class SingleCard extends Component {
  render() {
    return (
      <Card>
        <CardTitle title=""/>
        <CardText>
          {
            this.props.currentCard?
            ReactHtmlParser(this.props.currentCard.text):
            <div></div>
          }
        </CardText>
        <CardActions>
          <FlatButton label="Branch" />
        </CardActions>
      </Card>
    )
  } // end return
}
