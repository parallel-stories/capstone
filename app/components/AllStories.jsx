import React, { Component } from 'react'
import SingleStory from './SingleStory'

export default class AllStories extends Component {
  render() {
    return (
      <div>
      <div className="col-sm-4 col-md-4 col-lg-4" >
        {/* map through all stories, displaying 3 cards per row */}
        <SingleStory/>
      </div>
      </div>
    )
  }
}
