import {
  initializeDatabase,
  START_CARET,
  END_CARET 
} from './config'
import { expect } from 'chai'
import {
  fetchBluenileDiamonds
} from './helpers'

import {
  diamondsAddedBlueNile,
  getInitialBluenileDiamonds,
  getInitialStartIndex,
  getInitialEndIndex,
  incrementStartIndex,
  incrementEndIndex,
  incrementCaret,
  endIndexChanged,
  removeBlueNileDiamonds,
  removeStartIndex,
  removeEndIndex,
  removeCaret
} from './actionCreators'

import {
  store
} from './store'
import {
  prepareForSave,
  createCsvFileWriter,
  writeResultsToCsv,
  writeHeadersToCsv
} from './utils'

import mongoose from 'mongoose'
mongoose.Promise = require('bluebird')


const {getState, dispatch} = store
const resultFileName = 'results'
const writer = createCsvFileWriter(resultFileName)
const headersForCsv = [
  'myPickSelected',
  'hasVisualization',
  'table',
  'symmetry',
  'polish',
  'lxwRatio',
  'fluorescence',
  'depth',
  'cut',
  'culet',
  'color',
  'clarity',
  'shapeName',
  'shapeCode',
  'id',
  'skus',
  'shipsInDaysSet',
  'shipsInDays',
  'pricePerCarat',
  'price',
  'dateSet',
  'date',
  'carat',
  'detailsPageUrl',
  'detailsUrl',
  '_id'
]
// const writer = createCsvFileWriter(resultFileName)

const scrape = () => {
  const { 
    startIndex, 
    endIndex, 
    bluenileDiamonds,
    caret
     } = getState()
  console.log(`current status: ${bluenileDiamonds.length}, bluenile diamonds. startIndex: ${startIndex}, endIndex ${endIndex}, caret:${caret}`)
  if(caret > END_CARET) {
    console.log('done')
    process.exit()
  }
  fetchBluenileDiamonds(startIndex, caret)
  .then(diamonds => {
    if (diamonds && diamonds.length > 0) {
      return prepareForSave(diamonds)
    }
    else {
      throw({
        code: 300,
        status: 'End Reached'
      })
    }
  })
  .then(diamonds => dispatch(diamondsAddedBlueNile(diamonds)))
  .then(() => dispatch(incrementStartIndex()))
  .then(() => dispatch(incrementEndIndex()))
  .then(() => scrape())
  .catch(err => {
    console.log(err)
    //error is throw when we've gone too far
    switch(err.code) {
      case 300:
        return dispatch(incrementCaret())
          .then(() => dispatch(removeStartIndex()))
          .then(() => dispatch(removeEndIndex()))
          .then(() => scrape())
        default:
          console.log('got err', err.code)
    }
  })

}

const syncReduxWithMongooseData = () => {
  return Promise.all([
    dispatch(getInitialBluenileDiamonds()),
    dispatch(getInitialStartIndex()),
    dispatch(getInitialEndIndex()),
    dispatch(getInitialCaret())
  ])
}

const startFromScratch = () => {
  return Promise.all([
    dispatch(removeBlueNileDiamonds()),
    dispatch(removeStartIndex()),
    dispatch(removeEndIndex()),
    dispatch(removeCaret())
  ])
  .then(scrape)
}

initializeDatabase()
.then(() => dispatch(getInitialBluenileDiamonds()))
.then(() => {
  return writeHeadersToCsv(headersForCsv, writer)
})
.then(() => {
  const {bluenileDiamonds} = getState()
  return Promise.all(Promise.map(bluenileDiamonds, diamond => {
    return writeResultsToCsv(Object.keys(diamond._doc).map(k => diamond._doc[k]), writer)
  }))
})
.then(() => console.log('done'); process.exit())

