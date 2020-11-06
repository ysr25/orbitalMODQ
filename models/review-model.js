const mongoose = require('mongoose')
const moduleList = require('./module-list')
const sanitize = require('./utils').sanitize

const ReviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  moduleCode: {
    type: String,
    required: true,
    enum: moduleList
  },
  anonymous: {
    type: Boolean,
    required: true
  },
  upvotes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  downvotes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  editedAt: {
    type: Date,
    default: Date.now()
  }
}, {
  timestamps: true
})

ReviewSchema.index({ title: 'text', content: 'text' })

ReviewSchema.virtual('votes').get(function () {
  return this.upvotes.length - this.downvotes.length
})

ReviewSchema.post('find', function (next) {

})

ReviewSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    this.content = sanitize(this.content)
  }
  if (this.isModified('title') || this.isModified('content') || this.isModified('moduleCode')) {
    this.editedAt = Date.now()
  }
  return next()
})

ReviewSchema.methods.updateVotes = function (direction, newArray, next) {
  this[direction] = newArray
  console.log(this)
  this.save(function (err, review) {
    if (err) return next(err)
    return next(null, review)
  })
}

module.exports = mongoose.model('Review', ReviewSchema)
