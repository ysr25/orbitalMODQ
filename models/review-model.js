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
  }
})

ReviewSchema.index({ title: 'text', content: 'text' })

ReviewSchema.virtual('votes').get(function () {
  return this.upvotes.length - this.downvotes.length
})

ReviewSchema.pre('save', function (next) {
  const review = this

  if (review.isModified('content')) {
    review.content = sanitize(review.content)
  }
  review.dateEdited = Date.now()

  return next()
})

ReviewSchema.methods.updateVotes = function (direction, newArray, next) {
  return mongoose.model('ModReview').findByIdAndUpdate(
    this._id,
    { [direction]: newArray },
    { new: true, useFindAndModify: false },
    next
  )
}

module.exports = mongoose.model('ModReview', ReviewSchema)
