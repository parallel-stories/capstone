import React, { Component } from 'react'
import { Link } from 'react-router'

export default class NotFound extends Component {
  render() {
    const {pathname} = this.props.location || {pathname: '<< no path >>'}
    console.error('NotFound: %s not found (%o)', pathname, this.props)
    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <h1>Sorry, I couldn't find <pre>{pathname}</pre></h1>
          <p>Lost? <Link to="/">Here's a way home.</Link></p>
        </div>
      </div>
    )
  }
}
