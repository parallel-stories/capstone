import {combineReducers} from 'redux'
import allStories from './allStories'
import currentStoryline from './currentStoryline'
import currentCard from './currentCard'

export default combineReducers({
  allStories,
  currentStoryline,
  currentCard
})

export * from './allStories'
export * from './currentStoryline'
export * from './currentCard'

