import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class NotFound extends Component {
  render() {
    const {pathname} = this.props.location || {pathname: '<< no path >>'}
    console.error('NotFound: %s not found (%o)', pathname, this.props)
    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="container align-center">
      <h2>Sorry, we couldn't find what you were looking for.</h2>
      <h3>Lost? <Link to="/">Here's the way home.</Link></h3>
          </div>
        </div>
      </div>
    )
  }
}
