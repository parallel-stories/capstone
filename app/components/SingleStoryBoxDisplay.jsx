// react
import React, { Component } from 'react'

// material ui
import {Card, CardMedia, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

// material ui components for favorites
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border'

// link from react-router-dom
import {Link} from 'react-router-dom'

export default class SingleStoryBoxDisplay extends Component {
  constructor() {
    super()
  }

  render() {
    const {storyBranchTitle, storyBranchDetails, thisKey} = this.props
    
    return (
    <Card className="single-card col-lg-4 col-md-4 col-sm-4">
      <CardHeader>
        <RadioButton
          checkedIcon={<ActionFavorite style={{color: '#FFB6C1'}} />}
          uncheckedIcon={<ActionFavoriteBorder />} />
      </CardHeader>
      <Link key={thisKey} to={`/read/story_branch/${thisKey}`}>
        <CardMedia
          overlay={<CardTitle title={storyBranchTitle} subtitle={storyBranchDetails.storyRoot} />}
        >
          <img src="images/book_icon.svg" alt="" />
        </CardMedia>
        <CardText>
          No description available
        </CardText>
      </Link>
    </Card>
    )
  }
}
