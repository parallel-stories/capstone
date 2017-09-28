import React, { Component } from 'react'
import SingleStory from './SingleStory'
import Navbar from './Navbar'


export default class AllStories extends Component{
  render() {
    
    return (
      <div>
      <Navbar />
      {/*create SingleStory component and map thru it here, displaying 3 cards per row*/}
      <div className="col-sm-4 col-md-4 col-lg-4" >
        <SingleStory/>
      </div>
      </div>
    )
  }
}