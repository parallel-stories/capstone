import {combineReducers} from 'redux'
import allStories from './allStories'
import createCommunity from './createCommunity'
import createCard from './createCard'

export default combineReducers({
  allStories, createCommunity, createCard
})

export * from './allStories'
export * from './createCommunity'
export * from './createCard'
