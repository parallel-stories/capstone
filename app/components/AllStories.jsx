import React, { Component } from 'react'
import SingleStoryBoxDisplay from './SingleStory'
import firebase from 'app/fire'
import 'firebase/database'
import {fetchAllStories} from '../reducers'
import {connect} from 'react-redux'
import _ from 'lodash'
import { Link } from 'react-router-dom'

class AllStories extends Component {
  componentWillMount() {
    this.props.fetchAllStories()
  }

  render() {
    const {allStories} = this.props
    return (
      <div className="row">
        <div className="col-sm-4 col-md-4 col-lg-4" >
          {
            !_.isEmpty(allStories) && 
            Object.keys(allStories).map((key) => <Link to={`/read/story/${key}`}><SingleStoryBoxDisplay key={key} story={allStories[key]} /></Link>)
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    allStories: state.allStories
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     fetchAllStories
//   }
// }

export default connect(mapStateToProps, {fetchAllStories})(AllStories)
