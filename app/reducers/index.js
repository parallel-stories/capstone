import {combineReducers} from 'redux'
import allStories from './allStories'
import user from './user'

export default combineReducers({
  user,
  allStories
})

export * from './allStories'
export * from './user'
