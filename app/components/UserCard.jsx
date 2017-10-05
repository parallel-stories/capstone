import React, { Component } from 'react'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default class UserCard extends Component {

  render() {
    return (
      <Card className="single-card col-lg-4 col-md-4 col-sm-4">
        <CardHeader
          title="User Name"
          subtitle="N stories"
          avatar="http://via.placeholder.com/150x150"
          />
        <CardText>
          User description will go here
        </CardText>
        <CardActions>
          <FloatingActionButton mini={true} style={{marginRight: 20, boxShadow: "none"}}>
            <ContentAdd />
          </FloatingActionButton>
        </CardActions>
        <br />
      </Card>
    )
  }
}
