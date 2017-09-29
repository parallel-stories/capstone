import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers/root'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { fetchCurrentUser } from './reducers/login'

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, createLogger()))
export default store

