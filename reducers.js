import * as C from './constants'
import { 
  DEFAULT_START_INDEX, 
  DEFAULT_END_INDEX,
  START_CARET 
} from './config'


export const bluenileDiamonds = (state=[], action) => {
  switch(action.type) {
    case C.INITIAL_DIAMONDS_BLUENILE:
      return action.diamonds
    case C.DIAMONDS_ADDED_BLUENILE:
      return [...state, ...action.diamonds]
    case C.REMOVE_BLUENILE_DIAMONDS:
      return []
    default:
      return state
  }
}


export const startIndex = (state=DEFAULT_START_INDEX, action) => {
  switch(action.type) {
    case C.START_INDEX_CHANGED:
    case C.INITIAL_START_INDEX:
      return action.startIndex
    case C.REMOVE_START_INDEX:
      return DEFAULT_START_INDEX
    default:
      return state
  }
}

export const caret = (state=START_CARET, action) => {
  switch(action.type) {
    case C.CARET_CHANGED:
    case C.INITIAL_CARET:
      return action.caret
    case C.REMOVE_CARET:
      return START_CARET
    default:
      return state
  }
}

export const endIndex = (state=DEFAULT_END_INDEX, action) => {
  switch(action.type) {
    case C.END_INDEX_CHANGED:
    case C.INITIAL_END_INDEX:
      return action.endIndex
    case C.REMOVE_END_INDEX:
      return DEFAULT_END_INDEX
    default:
      return state
  }
}