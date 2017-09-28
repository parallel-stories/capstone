import React from 'react';
import {Card, CardMedia, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const SingleStory = () => (
  <Card>
    <CardMedia
      overlay={<CardTitle title="Storyline title" subtitle="Community Name" />}
    >
      <img src="images/book_icon.svg" alt="" />
    </CardMedia>
    <CardText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
  </Card>
);

export default SingleStory;