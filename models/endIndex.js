import mongoose from 'mongoose'
import {
  MIN_CARAT, 
  INCREMENT_VARIABLE,

} from '../config'

const endIndex = mongoose.Schema({
  id: Number,
  endIndex: Number
})

endIndex.statics.getMain = function() {
  return this.findOne({id:1})
          .then(res => {
            if(!!res) {
              return res
            }
            return this.create({id:1, endIndex:INCREMENT_VARIABLE}).then(this.save)
          })
}

endIndex.statics.increment = function() {
  return this.getMain()
          .then(res => this.update({id:1, endIndex: Math.floor(res.endIndex+INCREMENT_VARIABLE)}))
          .then(this.save)
          .then(() => this.findOne({id:1}))
          .then(res => res)
}

export default mongoose.model('endIndex', endIndex)