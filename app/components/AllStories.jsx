import React, { Component } from 'react'
import SingleStory from './SingleStory'
import Navbar from './Navbar'
import firebase from 'app/fire'
import 'firebase/database'

export default class AllStories extends Component{
  constructor() {
    super()
  }

  render() {

    return (
      <div>
      <Navbar />
      <div className="col-sm-4 col-md-4 col-lg-4" >
        {/*map through all stories, displaying 3 cards per row*/}
        <SingleStory/>
      </div>
      </div>
    )
  }
}

const mapStateToProps = state => {

}
