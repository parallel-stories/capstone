import firebase from 'app/fire'

const CREATE_COMMUNITY = 'CREATE_COMMUNITY'

export const createCommunity = community => {
  return {
    type: CREATE_COMMUNITY,
    community
  }
}

export default (community = {}, action) => {
  switch (action.type) {
    case CREATE_COMMUNITY:
      return action.community
    default:
      return community
  }
}

export const makeCommunity = (story, community) => {
  return dispatch => {
    return firebase.database().ref('stories').push(story)
    .then(() => firebase.database().ref('community').push(community))
    .then(console.log)
    // retrieve community id, update story
    // retrieve story id, update community
    // db.ref().child(`/path/to/${something}`)
    .catch(console.error)
  }
}
