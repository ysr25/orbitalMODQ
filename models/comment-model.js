const mongoose = require('mongoose')
const sanitize = require('./utils').sanitize

const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
}, {
  timestamps: true
})

CommentSchema.pre('save', function (next) {
  const comment = this
  comment.content = sanitize(comment.content)
  return next()
})

module.exports = mongoose.model('Comment', CommentSchema)
