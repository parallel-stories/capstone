const SET_CURRENT_CARD = 'SET_CURRENT_CARD'

export const setCurrentCard = (card) => {
  return {
    type: SET_CURRENT_CARD,
    card
  }
} 

export default (currentCard = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_CARD:
      return action.card
    default:
      return currentCard
  }
}