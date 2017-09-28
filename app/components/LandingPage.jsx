import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

// react components
import Navbar from './Navbar'

const style = {
  margin: 10
}

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
      console.log('clicked on read!')
    } else if (type === 'write') {
      this.props.history.push(`/write`)
    }
  }

  render() {
    return (
      <div className="container container-fluid landing-text">
        <Navbar/>
        <div className="row">
          <br/>
          <br/>
          <img src="http://placekitten.com/200/200" alt="logo depicting a tree"/>
          <h1>
            Welcome to <span className="title">Parallel Stories</span>!
          </h1>
          <p>
            Some Lorem Ipsum here etc.....
          </p>
        </div>
        <br />
        <div className="row">
          <div className="col col-4 col-lg-4 col-md-4 col-sm-4">
            <RaisedButton
              label="EXPLORE"
              backgroundColor="#D2B48C"
              style={style}
              onClick={(e) => { this.handleLink(e, 'read') }}
            />
          </div>
          <div className="col col-4 col-lg-4 col-md-4 col-sm-4">
            <RaisedButton
              label="READ"
              backgroundColor="#D2B48C"
              style={style}
              onClick={(e) => { this.handleLink(e, 'read') }}
            />
          </div>
          <div className="col col-4 col-lg-4 col-md-4 col-sm-4">
            <RaisedButton
              label="WRITE"
              backgroundColor="#D2B48C"
              style={style}
              onClick={(e) => { this.handleLink(e, 'write') }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LandingPage
