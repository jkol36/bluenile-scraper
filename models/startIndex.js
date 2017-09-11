import mongoose from 'mongoose'
import {
  MIN_CARAT, 
  INCREMENT_VARIABLE
} from '../config'

const startIndex = mongoose.Schema({
  id: Number,
  startIndex: Number
})

startIndex.statics.getMain = function() {
  return this.findOne({id:1})
          .then(res => {
            if(!!res) {
              return res
            }
            return this.create({id:1, startIndex:0}).then(this.save)
          })
}

startIndex.statics.increment = function() {
  return this.getMain()
          .then(res => this.update({id:1, startIndex: Math.floor(res.startIndex+INCREMENT_VARIABLE)}))
          .then(this.save)
          .then(() => this.findOne({id:1}))
          .then(res => res)
}

export default mongoose.model('startIndex', startIndex)