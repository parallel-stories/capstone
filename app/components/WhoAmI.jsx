import React from 'react'
import firebase from 'app/fire'
const auth = firebase.auth()

import history from '../history'
import Login from './Login'

import IconButton from 'material-ui/IconButton'
import LogOut from 'material-ui/svg-icons/action/exit-to-app'
import {lightGreen50, lightGreen600} from 'material-ui/styles/colors'

export const name = user => {
  if (!user) return 'Hello, Nobody'
  if (user.isAnonymous) return 'Anonymous'
  return user.displayName || user.email
}

export const WhoAmI = ({user, auth}) =>
  <div className="whoami">
    { // If nobody is logged in, or the current user is anonymous,
      (!user || user.isAnonymous)?
      // ...then show signin links...
      <Login auth={auth}/>
      /// ...otherwise, show a logout button.
      :
      <IconButton
        className='logout' onClick={() => auth.signOut().then( () => history.push(`/home`) )}
        tooltip={name(user)}>
        <LogOut color={lightGreen50} hoverColor={lightGreen600}/>
      </IconButton>
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
