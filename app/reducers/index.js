import {combineReducers} from 'redux'
import allStories from './allStories'
import currentStoryline from './currentStoryline'

export default combineReducers({
  allStories,
  currentStoryline
})

export * from './allStories'
export * from './currentStoryline'

