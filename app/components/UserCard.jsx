import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const UserCard = () => (
  <Card className="single-card col-lg-4 col-md-4 col-sm-4">
    <CardHeader
      title="URL Avatar"
      subtitle="Subtitle"
    />
    <CardMedia
      overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
    >
      <img src="images/nature-600-337.jpg" alt="" />
    </CardMedia>
    <CardTitle title="Card title" subtitle="Card subtitle" />
    <CardText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
    <CardActions>
      <FlatButton label="Action1" />
      <FlatButton label="Action2" />
    </CardActions>
  </Card>
);

export default UserCard;
