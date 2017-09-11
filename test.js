import { expect } from 'chai'
import {
  fetchBluenileDiamonds
} from './helpers'
import {
  initializeDatabase,
  DEFAULT_START_INDEX,
  DEFAULT_END_INDEX,
  INCREMENT_VARIABLE,
  CARET_INCREMENT_VARIABLE,
  START_CARET

} from './config'
require('./config')
import {
  buildFilter,
  removeFile,
  writeHeadersToCsv,
  createCsvFileWriter,
  filter,
  prepareForSave
} from './utils'
import mongoose from 'mongoose'
import {store} from './store'
import {
  diamondsAddedBlueNile,
  getInitialCaret,
  removeEndIndex,
  removeStartIndex,
  removeBlueNileDiamonds,
  getInitialBluenileDiamonds,
  incrementStartIndex,
  getInitialStartIndex,
  getInitialEndIndex,
  incrementEndIndex,
  incrementCaret,
  removeCaret
} from './actionCreators'
const { dispatch, getState } = store



describe('bluenile database', () => {
  before(done => {
    mongoose.connect(process.env.TEST_DATABASE_URL, {useMongoClient:true})
    .then(() => {
      let models = ['bluenileDiamond', 'startIndex', 'endIndex']
      let promises = Promise.map(models, model => {
        return mongoose.model(model).remove({})
      return Promise.all(promises)
      })
    })
    .then(done)
    .catch(done)
  })
  it('should get start index', done => {
    dispatch(getInitialStartIndex())
    .then(startIndex => {
      expect(startIndex).to.not.be.undefined
      expect(startIndex).to.eq(0)
      done()
    })
  })
  it('should increment start index by 257', done => {
    dispatch(incrementStartIndex())
    .then(res => {
      let {startIndex} = res
      expect(startIndex).to.not.be.undefined
      expect(startIndex).to.eq(INCREMENT_VARIABLE)
      done()
    })
  })
  it('should get endIndex', done => {
    dispatch(getInitialEndIndex())
    .then(endIndex => {
      expect(endIndex).to.not.be.undefined
      expect(endIndex).to.eq(DEFAULT_END_INDEX)
      done()
    })
  })
  it('should increment endIndex', done => {
    dispatch(incrementEndIndex())
    .then(endIndex => {
      expect(endIndex).to.eq(514)
      done()
    })
  })
  it('should find bluenile diamonds ', done => {
    dispatch(getInitialBluenileDiamonds())
    .then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.eq(0)
      done()
    })
  })
  it('should remove bluenile diamonds from mongo', done => {
    dispatch(removeBlueNileDiamonds())
    .then(res => {
      expect(res).to.be.ok
      done()
    })
  })
  it.only('should get default caret', done => {
    dispatch(getInitialCaret())
    .then(caret => {
      expect(caret).to.eq(START_CARET)
      done()
    })
  })
})
describe('bluenile scraper', () => {
  let diamondsFromBluenile
  let diamondsFormatted 
  it('should fetch diamonds from bluenile given a start index', done => {
    fetchBluenileDiamonds(0)
    .then(diamonds => {
      expect(diamonds).to.be.an('array')
      diamondsFromBluenile = diamonds
      done()
    })
  })
  it('should convert each key value pair to a string for every diamond', done => {
    prepareForSave(diamondsFromBluenile)
    .then(diamonds => {
      expect(diamonds).to.not.be.undefined
      expect(diamonds).to.be.an('array')
      diamondsFormatted = diamonds
      done()
    })
  })
  it('should save diamonds in mongodb and redux', done => {
    expect(diamondsFormatted).to.not.be.undefined
    dispatch(diamondsAddedBlueNile(diamondsFormatted))
    .then(res => {
      expect(res).to.not.be.undefined
      let {bluenileDiamonds} = getState()
      expect(bluenileDiamonds).to.be.an('array')
      expect(bluenileDiamonds.length).to.be.gt(0)
      mongoose
      .model('bluenileDiamond')
      .find({})
      .then(res => {
        expect(res).to.not.be.undefined
        console.log(res)
        done()
      })
    })
  })
})


