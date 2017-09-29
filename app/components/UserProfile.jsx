// react
import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import { connect } from 'react-redux'
import { fetchCurrentUser } from '../reducers/user'

// other components
import Navbar from './Navbar'

class UserProfile extends Component {

  render() {
    return (
      <div className="container-fluid" >
        <Navbar/>
        <h1>Welcome User!</h1>
        <p>Email: useremail </p>
        <div className="row" >

        </div>
      </div>
    )
  } 
}

const mapState = null

const mapDispatch = (dispatch) => {
  return {
    someFetchFunc: () => {
      dispatch(fetchCurrentUser())
    }
  }
}

export default connect(mapState, mapDispatch)(UserProfile)