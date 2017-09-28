//firebase
import firebase from 'app/fire'
const auth = firebase.auth()
const google = new firebase.auth.GoogleAuthProvider()

const INITIALIZE_USER = 'INITIALIZE_USER'

const initializeUser = user => ({ type: INITIALIZE_USER, user})

export default function loginReducer(user={}, action){
  switch (action.type) {
    case INITIALIZE_USER:
      return action.user
    default:
      return user
  }
}

export const fetchCurrentUser = () => dispatch => {
  auth.signInWithPopup(google)
    .then((result) => {
      dispatch(initializeUser({name:result.user.displayName, email: result.user.email}))
    })
    .catch(console.error)
}