import firebase from 'app/fire'
//import 'firebase/database'

const GET_ALL_STORIES = 'GET_ALL_STORIES'

export const getAllStories = allStories => {
  return {
    type: GET_ALL_STORIES,
    allStories
  }
}

export default (stories = {}, action) => {
  switch (action.type) {
  case GET_ALL_STORIES:
    return action.allStories
  default:
    return stories
  }
}

export const fetchAllStories = () => {
  console.log('IN FETCH')
  return dispatch => {
    console.log('IN REQUEST')
    return firebase.database().ref().child('stories').on('value', snap => {
      console.log('IN SNAP', snap.val())
      dispatch(getAllStories(snap.val()))
    })
  }
}
