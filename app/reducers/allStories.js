import firebase from 'app/fire'
import _ from 'lodash'
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
  return dispatch => {
    return firebase.database().ref().child('stories').on('value', snap => {
      const communityIdArr = _.map(snap.val(), story => firebase.database().ref(`community/${story.communityId}`).once('value'))
      Promise.all(communityIdArr)
        .then(community => {
          const allStories = snap.val()
          const allStoriesKeys = Object.keys(snap.val())
          for (let i = 0; i < community.length; i++) {
            allStories[allStoriesKeys[i]].community = community[i].val()
          }
          return allStories
        })
        .then(result => dispatch(getAllStories(result)))
    })
  }
}
