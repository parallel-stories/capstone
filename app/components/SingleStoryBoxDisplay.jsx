import React from 'react'
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

const SingleStoryBoxDisplay = ({storyBranchTitle, storyBranchDetails}) => {
  return (
  <Card className="single-card col-lg-4 col-md-4 col-sm-4">
    <CardMedia
      overlay={<CardTitle title={storyBranchTitle} subtitle={storyBranchDetails.storyRoot} />}
    >
      <img src="images/book_icon.svg" alt="" />
    </CardMedia>
    <CardText>
      No description available
    </CardText>
  </Card>
  )
}

export default SingleStoryBoxDisplay
