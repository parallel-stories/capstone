import React, { Component } from 'react'

// material ui
import { Card, CardHeader, CardText } from 'material-ui/Card'
import { connect } from 'react-redux'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

// firebase
import firebase from 'app/fire'
import 'firebase/database'
const auth = firebase.auth()

// lodash
import _ from 'lodash'

// import from another component
import Ratings from './Ratings'

export default class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: {},
      // controls whether the box to submit reviews is open or not
      open: false,
      // for the review
      userRating: 0,
      userReview: '',
      userId: null,
      // to check for inputs
      dirty: false,
    }

  }

  componentDidMount() {
    this.favesListener = firebase.database().ref(`review/${this.props.storyId}`)
    this.favesListener.on('value', snap => {
      const reviews = snap.val()
      this.setState({ reviews })
    })
  }

  componentWillUnmount() {
    if (this.reviewListener) this.reviewListener.off()
  }

  // handles the dialog modal
  handleOpen = () => {
		this.setState({ open: true });
	}
  handleClose = () => {
		this.setState({ open: false, dirty: false  });
	}

  // handles changing items inside the form
  setRating = (value) => {
    this.setState({
      userRating: value
    })
  }

  changeReview = (evt) => {
    this.setState({
      userReview: evt.target.value,
      dirty: true
    })
  }

  // send review to firebase
  addNewReview = (review) => {
    const newKey = Object.keys(this.state.reviews).length + 1
    firebase.database().ref('review').child(this.props.storyId).child(newKey).set(review)
  }

  // handles submitting the form
  handleSubmit = (evt) => {
    evt.preventDefault();

    const review = {
      content: this.state.userReview,
      rating: this.state.userRating,
      userId: this.state.userId,
      storyId: this.props.storyId,
    }

    this.addNewReview(review)

    this.setState({
      open: false,
      userRating: 0,
      userReview: '',
      dirty: false
    })
  }

  render() {
    const storyReviews = this.state.reviews;
    const storyId = this.props.storyId;

    // warning if user enters invalid length into comment box
    const inputValue = this.state.userReview;
    const dirty = this.state.dirty;

    let warning = '';
    let disableSubmit = inputValue.length>500 || inputValue.length<=0 || this.state.userRating===0

    if (!inputValue && dirty) warning = 'The comment cannot be blank'
    else if (inputValue.length > 500 && dirty) warning = 'Review must be less than 500 characters'
    else if (this.state.userRating === 0 && dirty) warning = 'Give the story a rating!'

    // actions are: close form, open form
    const actions =
    [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose}/>,
      <FlatButton label="Submit" primary={true} onClick={this.handleSubmit} disabled={disableSubmit}/>
    ]

    console.log("WHAT ARE REVIEWS", storyReviews)

    return (
      <div className="container review">
        <br />
        <h3 className="review-header"> Ratings & Reviews </h3>
          {
          <div className='add-review-form'>
            <RaisedButton label="Add a Review"
              primary={true}
              onClick={this.handleOpen}
            />
            <br />
            <Dialog
              title={`Write a Review for ${storyId}`}
              actions={actions}
              modal={true}
              open={this.state.open}
              autoScrollBodyContent={true}
            >
              <form onSubmit={this.onSubmit}>
                <Ratings
                  value={this.state.userRating}
                  max={5}
                  onChange={this.setRating}/>
                <TextField
                  hintText="Write your review here"
                  floatingLabelText="Review"
                  name="review"
                  fullWidth={true}
                  multiLine={true}
                  onChange={this.changeReview}
                />
              { warning && <p className="alert alert-warning">{warning}</p> }
              <br />
              </form>
            </Dialog>
          </div>
          }
          {Object.keys(storyReviews).length===0?
            <p>
              There are no reviews for <b>{storyId}</b> yet. Step right up and be the first to review 🖋!
            </p>
            :
            <p>
              There are no reviews for <b>{storyId}</b> yet. Step right up and be the first to review 🖋!
            </p>
          }
          <br />
          <br />
      </div>
    )
  }

}
