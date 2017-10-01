import React from 'react'
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

<<<<<<< HEAD:app/components/SingleStoryBoxDisplay.jsx
const SingleStoryBoxDisplay = ({story}) => (
=======
const SingleStory = ({storyBranchTitle, storyBranchDetails}) => {
  return (
>>>>>>> master:app/components/SingleStory.jsx
  <Card>
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
