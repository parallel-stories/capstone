import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

// page
import history from '../history'

const landingStyles = {
  button: {
    boxShadow: "none",
    marginBottom: "20px",
    minWidth:"75px"
  },
};

class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleLink = this.handleLink.bind(this)
  }

  handleLink = (e, type) => {
    history.push(`/${type}`)
  }

  render() {
    return (
      <div className="landing-page">
        <div className="row welcome-header">
          <div className="col col-sm-6 col-md-6 col-lg-6 welcome-image">
            <img src="https://image.flaticon.com/icons/svg/140/140671.svg" alt="logo depicting a tree" />
          </div>
          <div className="col col-sm-6 col-md-6 col-lg-6 align-right">
            <h1>
              Welcome to <span className="title">Parallel Stories</span>!
            </h1>
            <p>
              Use the navigation bar on the top left of this page to Write a Story, Read Stories, Favorite Stories, and See your user profile!
              Also, please give us feedback using this{' '}
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSeUBon3g9H6Ymanjoi1-BZHQGafJuJytHt7Cs8Le_IPLgOoeg/viewform" target="_blank">form</a>
            </p>
          </div>
        </div>

        <br />

        <div className="container container-fluid">
          <div className="row">
            <h1 className="landing-page-select align-center">
              explore/read all stories available or write a story of your own.
            </h1>
            <br />
          </div>
          <div className="row">
            <div className="col col-4 col-lg-4 col-md-4 col-sm-4 align-center">
              <RaisedButton
                label="EXPLORE"
                onClick={(e) => { this.handleLink(e, 'read') }}
                backgroundColor='#D1B38E'
                style={landingStyles.button}
              />
            </div>
            <div className="col col-4 col-lg-4 col-md-4 col-sm-4 align-center">
              <RaisedButton
                label="READ"
                onClick={(e) => { this.handleLink(e, 'read') }}
                backgroundColor='#D1B38E'
                style={landingStyles.button}
              />
            </div>
            <div className="col col-4 col-lg-4 col-md-4 col-sm-4 align-center">
              <RaisedButton
                label="WRITE"
                onClick={(e) => { this.handleLink(e, 'write') }}
                backgroundColor='#50AD55'
                style={landingStyles.button}
              />
            </div>
          </div>
        </div>

        <br />

        <div className="landing-more-info align-center">
          <div className="row">
            <h3>Thank you for visiting our capstone project!</h3>
            <p>This project's frontened was created with React and Material-UI</p>
            <p>This project's backend is hosted on Firebase</p>
            <p>More info about individual members here? or nah?</p>
          </div>
        </div>

      </div>
    )
  }
}

export default LandingPage
