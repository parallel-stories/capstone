import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setStoryline} from '../reducers'
import {Link} from 'react-router-dom'

class SingleStoryPage extends Component {
  componentWillMount() {
    this.props.getCurrentStoryline()
  }

  render() {
    return (
      <div>
        <img src="images/book_icon.svg" alt="" />
        <h2>{this.props.currentStoryline.title}</h2>
        <Link to={`/read/story/${this.props.currentStoryline.id}/${this.props.currentStoryline.startCard}`}>Start Reading</Link>
      </div>
    )}
}

const mapStateToProps = state => {
  return {    
    currentStoryline: state.currentStoryline
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCurrentStoryline: (storyId) => {
      dispatch(setStoryline(storyId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleStoryPage)
