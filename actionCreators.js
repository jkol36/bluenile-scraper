import * as C from './constants'
import mongoose from 'mongoose'


export const diamondsAddedBlueNile = (diamonds) => dispatch => {
  return new Promise(resolve => {
    let promises = Promise.map(diamonds, (diamond, index) => {
      return mongoose
              .model('bluenileDiamond')
              .create(diamond)
              .then(res => {
                return res.save()
              })
              .catch(err => {
                console.log(err)
                return err
              })
    })
    Promise.all(promises).then(() => {
        dispatch({
        type: C.DIAMONDS_ADDED_BLUENILE,
        diamonds
      })
      resolve(diamonds)
    })
    
  })

}

export const getInitialBluenileDiamonds = (diamondCollection) => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('bluenileDiamond')
    .find({})
    .then(diamonds => {
        dispatch({
        type: C.INITIAL_DIAMONDS_BLUENILE,
        diamonds
      })
      resolve(diamonds)
    })
  })
}

export const removeBlueNileDiamonds = () => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('bluenileDiamond')
    .remove()
    .then(() => {
      dispatch({
        type: C.REMOVE_BLUENILE_DIAMONDS
      })
      resolve([])
    })
    .then(resolve)
  })
}
export const removeStartIndex = () => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('startIndex')
    .find({id:1})
    .remove()
    .then(() => {
      dispatch({
        type: C.REMOVE_START_INDEX
      })
      resolve()
    })
  })
}

export const getInitialCaret = () => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('caret')
    .getMain()
    .then(res => {
      dispatch({
        type: C.INITIAL_CARET,
        caret: res.caret
      })
      resolve(res.caret)
    })
  })
}

export const incrementCaret = () => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('caret')
    .increment()
    .then(res => {
      dispatch({
        type: C.CARET_CHANGED,
        caret: res.caret
      })
      resolve(res.caret)
    })
  })
}

export const removeCaret = () => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('caret')
    .find({id:1})
    .remove()
    .exec()
    .then(() => {
      dispatch({
        type: C.REMOVE_CARET
      })
      resolve()
    })
  })
}

export const removeEndIndex = () => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('endIndex')
    .find({id:1})
    .remove()
    .then(() => {
      dispatch({
        type: C.REMOVE_END_INDEX
      })
      resolve()
    })
  })
}


export const incrementStartIndex = () => dispatch => {
  return new Promise(resolve => {
    mongoose.model('startIndex')
      .increment()
      .then(res => {
        resolve(dispatch({
        type: C.START_INDEX_CHANGED,
        startIndex: res.startIndex
        }))
      })
  })
}

export const getInitialStartIndex = () => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('startIndex')
    .getMain()
    .then(res => {
      dispatch({
        type:C.INITIAL_START_INDEX,
        startIndex: res.startIndex
      })
      resolve(res.startIndex)
    
    })
  })
}

export const getInitialEndIndex = () => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('endIndex')
    .getMain()
    .then(res => {
      dispatch({
        type:C.INITIAL_END_INDEX,
        endIndex: res.endIndex
      })
      resolve(res.endIndex)
    })
  })
}

export const incrementEndIndex = () => dispatch => {
  return new Promise(resolve => {
    mongoose
    .model('endIndex')
    .increment()
    .then(res => {
      dispatch({
        type:C.END_INDEX_CHANGED,
        endIndex:res.endIndex
      })
      resolve(res.endIndex)
    })
  })
}