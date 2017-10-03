import React from 'react'
import firebase from 'app/fire'
const auth = firebase.auth()
import 'firebase/database'

import Login from './Login'

export const name = user => {
  if (!user) return 'Nobody'
  if (user.isAnonymous) return 'Anonymous'
  return user.displayName || user.email
}

export const WhoAmI = ({user, auth}) =>
  <div className="whoami">
    <span className="whoami-user-name">Hello, {name(user)}</span>
    { // If nobody is logged in, or the current user is anonymous,
      (!user || user.isAnonymous)?
      // ...then show signin links...
      <Login auth={auth}/>
      /// ...otherwise, show a logout button.
      : <button className='logout' onClick={() => auth.signOut()}>logout</button> }
  </div>

export default class extends React.Component {
  componentDidMount() {
    const {auth} = this.props
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}, ()=>{
      let users
      firebase.database().ref().child('user').on('value', snap => {
        users = snap.val()
      })
      if( user ) {
        {
          /*  check if user exists
          if not, add id to our *user* database */
        }
        for(const u in users) {
          {/*  exit out if user exists */ }
          if( user.uid===u.uid) break
        }
        {/* else add user to our db */ }
        console.log('creating a new user with a huge callstack ')
        firebase.database().ref('user').push(card)
      } {/* end if statement */ }
    }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  doesUserExist( user, userArr ) {
    for(let u; u<userArr.length; u++) {
      {/* exit out if user exists*/ }
      if( user===userArr[u]) return
    }
    {/* else add user to our db */ }

  }

  render() {
    const {user} = this.state || {}
    return <WhoAmI user={user} auth={auth}/>
  }
}
