import React, { Component } from 'react'
import SingleStory from './SingleStory'


export default class AllStories extends Component{
  render() {
    return (
      <div>
      {/*create SingleStory component and map thru it here, displaying 2 cards per row*/}
      <SingleStory/>
      </div>
    )
  }
}