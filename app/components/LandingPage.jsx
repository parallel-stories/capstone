import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleLink = this.handleLink.bind(this)
  }

  handleLink = (e, type) => {
    if (type === 'home') {
      this.props.history.push(`/home`)
    } else if (type === 'read') {
      this.props.history.push(`/read`)
    } else if (type === 'write') {
      this.props.history.push(`/write`)
    }
  }

  render() {
    return (
      <div>

        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12 alignCenter">
            <img src="http://lorempixel.com/200/200/nature/" alt="logo depicting a tree" />
            <h1>
              Welcome to <span className="title">Parallel Stories</span>!
            </h1>
            <p>
              Some Lorem Ipsum here etc.....
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col col-4 col-lg-4 col-md-4 col-sm-4 alignCenter raisedButton">
            <RaisedButton
              label="EXPLORE"
              onClick={(e) => { this.handleLink(e, 'read') }}
            />
          </div>
          <div className="col col-4 col-lg-4 col-md-4 col-sm-4 alignCenter raisedButton">
            <RaisedButton
              label="READ"
              onClick={(e) => { this.handleLink(e, 'read') }}
            />
          </div>
          <div className="col col-4 col-lg-4 col-md-4 col-sm-4 alignCenter raisedButton landingButton">
            <RaisedButton
              label="WRITE"
              onClick={(e) => { this.handleLink(e, 'write') }}
            />
          </div>
        </div>

      </div>
    )
  }
}

export default LandingPage
