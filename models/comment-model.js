const mongoose = require('mongoose')

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
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ModReview'
  },
  datePosted: {
    type: Date,
    default: Date.now
  }
})

CommentSchema.pre('save', function (next) {
  const comment = this
  comment.content = sanitize(comment.content)
  return next()
})

module.exports = mongoose.model('Comment', CommentSchema)
