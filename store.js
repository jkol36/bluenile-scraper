import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import {
  bluenileDiamonds,
  startIndex,
  endIndex,
  caret
} from './reducers'

export const store = createStore(combineReducers({
  bluenileDiamonds,
  startIndex,
  endIndex,
  caret
}), applyMiddleware(thunk));