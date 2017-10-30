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
  getInitialCaret,
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
const resultFileName = 'results1'
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

const scrapeAndSaveInMongo = () => {
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
  .delay(5000)
  .then(() => scrapeAndSaveInMongo())
  .catch(err => {
    console.log(err)
    //error is throw when we've gone too far
    switch(err.code) {
      case 300:
        return dispatch(incrementCaret())
          .then(() => dispatch(removeStartIndex()))
          .then(() => dispatch(removeEndIndex()))
          .then(() => scrapeAndSaveInMongo())
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
  .then(scrapeAndSaveInCsv)
}

const writeDiamondsToCsv = () => {
  return initializeDatabase()
  then(() => syncReduxWithMongooseData())
  .then(() => {
    const {bluenileDiamonds} = getState()
    let headersForCsv = Object.keys(bluenileDiamonds[0]._doc).map(k => k)
    return writeHeadersToCsv(headersForCsv, writer)
    .then(() => {
      return Promise.all(Promise.map(bluenileDiamonds, diamond => {
        return writeResultsToCsv(Object.keys(diamond._doc).map(k => diamond[k]), writer)
      }))
    })
  })
}

const scrapeAndSaveInCsv = () => {
  console.log('scraping and saving in csv')
  const { 
    startIndex, 
    endIndex, 
    bluenileDiamonds,
    caret
     } = getState()
  console.log(`current status: startIndex: ${startIndex}, endIndex ${endIndex}, caret:${caret}`)
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
  .then(diamonds => {
    return Promise.map(diamonds, diamond => {
      return writeResultsToCsv(Object.keys(diamond).map(k => diamond[k]), writer)
    })
  })
  .then(() => dispatch(incrementStartIndex()))
  .then(() => dispatch(incrementEndIndex()))
  .then(scrapeAndSaveInCsv)
  .catch(err => {
    console.log(err)
    //error is throw when we've gone too far
    switch(err.code) {
      case 300:
        return dispatch(incrementCaret())
          .then(() => dispatch(removeStartIndex()))
          .then(() => dispatch(removeEndIndex()))
          .then(() => scrapeAndSaveInCsv())
        default:
          console.log('got err', err.code)
    }
  })
}

initializeDatabase()
.then(() => writeHeadersToCsv(headersForCsv, writer))
.then(() => startFromScratch())
.catch(console.log)

/*initializeDatabase()
.then(startFromScratch)
.catch(console.log)*/
//initializeDatabase()
//.then(startFromScratch)
// initializeDatabase()
// .then(() => dispatch(getInitialBluenileDiamonds()))
// .then(() => {
//   return writeHeadersToCsv(headersForCsv, writer)
// })
// .then(() => {
//   const {bluenileDiamonds} = getState()
//   return Promise.all(Promise.map(bluenileDiamonds, diamond => {
//     return writeResultsToCsv(Object.keys(diamond._doc).map(k => diamond._doc[k]), writer)
//   }))
// })
// .then(() => console.log('done'); process.exit())

