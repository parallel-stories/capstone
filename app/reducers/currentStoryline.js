import {setCurrentCard} from './currentCard'

const SET_CURRENT_STORYLINE = 'SET_CURRENT_STORYLINE'

const setCurrentStoryline = (story) => {
  return {
    type: SET_CURRENT_STORYLINE,
    story
  }
} 

export default (currentStoryline = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_STORYLINE:
      return action.story
    default:
      return currentStoryline
  }
}

export const fetchCurrentStoryline = (storyId) => {
  return dispatch => {
    return firebase.database().ref(`stories/${storyId}`).once('value')
    .then(result => result.val())
    .then(story => {
      story.id = storyId
      dispatch(setCurrentStoryline(story))
      console.log(story)
      //dispatch(setCurrentCard(story.cards[story.startCard]))
    })
 }
}