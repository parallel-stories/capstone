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

import Ratings from './Ratings'

export default class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      // controls whether the box to submit reviews is open or not
      open: false,
      // for the review
      userRating: 5,
      userReview: '',
      // to check for inputs
      dirty: false
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.setRating = this.setRating.bind(this);
    this.changeReview = this.changeReview.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  };

  // handles the dialog modal
  handleOpen() {
		this.setState({ open: true });
	}
  handleClose() {
		this.setState({ open: false, dirty: false  });
	}

  // handles changing items inside the form
  setRating(event, index, value) {
    this.setState({
      userRating: value
    })
  };

  changeReview(evt) {
    this.setState({
      userReview: evt.target.value,
      dirty: true
    })
  };

  // handles submitting the form
  handleSubmit(evt) {
    evt.preventDefault();

    const review = {
      content: this.state.userReview,
      rating: this.state.userRating,
      productId: this.props.productId,
      userId: this.props.currentUser.id || null
    }

    this.props.addNewReview(review)
    this.setState({
      open: false,
      userRating: 0,
      userReview: '',
      dirty: false
    })
  };

  componentDidMount() {

	};

  render() {
    const productReviews = this.props.reviews;
    const productName = this.props.productName;

    // warning if user enters invalid length into comment box
    const inputValue = this.state.userReview;
    const dirty = this.state.dirty;
    let warning = '';
    let disableSubmit = inputValue.length > 500 || inputValue.length<=0;

    if (!inputValue && dirty) warning = 'The comment cannot be blank';
    else if (inputValue.length > 500 && dirty) warning = 'Review must be less than 500 characters';
    // actions are: close form, open form
    const actions =
    [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose}/>,
      <FlatButton label="Submit" primary={true} onClick={this.handleSubmit} disabled={disableSubmit}/>
    ];

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
              title={`Write a Review for ${productName}`}
              actions={actions}
              modal={true}
              open={this.state.open}
              autoScrollBodyContent={true}
            >
              <form onSubmit={this.onSubmit}>
                <DropDownMenu value={this.state.userRating} onChange={this.setRating}>
                  <MenuItem value={5} primaryText="⭐⭐⭐⭐⭐"/>
                  <MenuItem value={4} primaryText="⭐⭐⭐⭐"/>
                  <MenuItem value={3} primaryText="⭐⭐⭐"/>
                  <MenuItem value={2} primaryText="⭐⭐"/>
                  <MenuItem value={1} primaryText="⭐"/>
                  <MenuItem value={0} primaryText="No stars"/>
                </DropDownMenu>
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
            <br />
            </div>
          }
          {
          productReviews && productReviews.map( review => (
            <Card key={review.id}>
              <CardHeader
                title={`Review for ${productName}`}
              />
              <Rating
                value={review.rating}
                max={5}
                readOnly={true}
              />
              <CardText> {review.content} </CardText>
            </Card>
          ))
          }
      </div>
    )
  }

}
