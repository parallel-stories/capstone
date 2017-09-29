import {combineReducers} from 'redux'
import allStories from './allStories'
import login from './login'

export default combineReducers({
  login,
  allStories
})

export * from './allStories'
