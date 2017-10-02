import firebase from 'app/fire'

const CREATE_CARD = 'CREATE_CARD'

export const createCard = card => {
  return {
    type: CREATE_CARD,
    card
  }
}

export default (card = {}, action) => {
  switch (action.type) {
    case CREATE_CARD:
      return action.card
    default:
      return card
  }
}

export const makeCard = (card) => {
  return dispatch => {
    return firebase.database().ref('cards').push(card)
    .then(data => data.key)
    .catch(console.error)
  }
}
