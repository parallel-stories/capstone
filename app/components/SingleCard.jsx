// react
import React, { Component } from 'react'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class SingleCard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Card>
        <CardTitle title="Card title"/>
        <CardText>
          Walk on car leaving trail of paw prints on hood and windshield. Jump launch to pounce upon little yarn mouse, bare fangs at toy run hide in litter box until treats are fed spread kitty litter all over house hopped up on catnip, and leave hair everywhere, yet mice so get video posted to internet for chasing red dot why must they do that. Get video posted to internet for chasing red dot lick face hiss at owner, pee a lot, and meow repeatedly scratch at fence purrrrrr eat muffins and poutine until owner comes back.
        </CardText>
        <CardActions>
          <FlatButton label="Branch" />
        </CardActions>
      </Card>
    )
  } // end return
}
