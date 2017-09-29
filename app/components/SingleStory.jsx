import React from 'react'
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

const SingleStory = ({story}) => (
  <Card>
    <CardMedia
      overlay={<CardTitle title={story.title} subtitle="something" />}
    >
      <img src="images/book_icon.svg" alt="" />
    </CardMedia>
    <CardText>
      {story.description}
    </CardText>
  </Card>
)

export default SingleStory
