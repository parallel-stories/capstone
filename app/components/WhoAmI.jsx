import React from 'react'
import firebase from 'app/fire'
const auth = firebase.auth()

import history from '../history'
import Login from './Login'

import FlatButton from 'material-ui/FlatButton'

export const name = user => {
  if (!user) return 'Hello, Nobody'
  if (user.isAnonymous) return 'Anonymous'
  return user.displayName || user.email
}

const loggingStyles = {
  button: {
    boxShadow: "none",
    minWidth:"75px",
    color: "#FFFFFF"
  },
}


export const WhoAmI = ({user, auth}) =>
  <div className="whoami">
    { // If nobody is logged in, or the current user is anonymous,
      (!user || user.isAnonymous)?
      // ...then show signin links...
      <Login auth={auth}/>
      /// ...otherwise, show a logout button.
      :
      <FlatButton
        className='google-login'
        onClick={() => auth.signOut().then( () => history.push(`/home`) )}
        label="LOGOUT"
        style={loggingStyles.button} />

    }
  </div>

export default class extends React.Component {
  componentDidMount() {
    const {auth} = this.props
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {user} = this.state || {}
    return <WhoAmI user={user} auth={auth}/>
  }
}
