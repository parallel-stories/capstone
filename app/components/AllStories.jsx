import React, { Component } from 'react'
import SingleStory from './SingleStory'
import firebase from 'app/fire'
import 'firebase/database'
import {fetchAllStories} from '../reducers'
import {connect} from 'react-redux'
import _ from 'lodash'

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
            !(_.isEmpty(allStories)) && Object.keys(allStories).map(key => <SingleStory key={key} story={allStories[key]} />)
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
