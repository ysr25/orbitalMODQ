const Review = require('../models/review-model')
const Comment = require('../models/comment-model')

exports.getAllReviews = async (req, res, next) => {
  Review.find()
    .populate('author')
    .exec((err, reviews) => {
      if (err) return next(err)
      res.locals.content = reviews
      next()
    })
}

exports.getOneReview = (req, res, next) => {
  Review.findById(req.params.modReviewId)
    .populate('author')
    .exec((err, review) => {
      if (err) return next(err)
      res.locals.content = review
      next()
    })
}

exports.getComments = (req, res, next) => {
  Comment.find({ post_id: req.params.modReviewId })
    .populate('author')
    .exec((err, comments) => {
      if (err) return next(err)
      res.locals.content = comments
      next()
    })
}

exports.postComment = (req, res, next) => {
  const newComment = new Comment({
    content: req.body.content,
    author: req.user._id,
    post_id: req.params.modReviewId
  })

  newComment.save((err, result) => {
    if (err) return next(err)
    res.locals.msg = 'New comment added successfully.'
    res.locals.content = result
    next()
  })
}

exports.postReview = (req, res, next) => {
  const newPost = new Review({
    title: req.body.title,
    content: req.body.content,
    moduleCode: req.body.moduleCode
  })
  if (req.user) {
    newPost.author = req.user._id
    newPost.anonymous = req.body.anonymous
  } else if (req.body.anonymous) {
    newPost.anonymous = true
  } else {
    const error = new Error('Please log in or choose to post anonymously.')
    error.status = 403
    return next(error)
  }
  newPost.save((err, result) => {
    if (err) return next(err)
    res.locals.msg = 'Module review created successfully.'
    res.locals.content = result
    next()
  })
}

exports.checkIfUserIsPoster = (req, res, next) => {
  if (!req.user) {
    res.locals.content = false
    return next()
  }
  Review.findOne({ _id: req.params.modReviewId }, (err, review) => {
    if (err) return next(err)
    res.locals.content = String(review.author) === String(req.user._id)
    next()
  })
}

exports.editReview = (req, res, next) => {
  Review.findOne({ _id: req.params.modReviewId }, (err, review) => {
    if (err) return next(err)
    if (String(review.author) !== String(req.user._id)) {
      const error = new Error('You can only edit your own post.')
      error.status = 403
      return next(error)
    }
    for (const field in req.body) {
      review[field] = req.body[field]
    }
    review.save((err, result) => {
      if (err) return next(err)
      res.locals.msg = 'Module review updated successfully.'
      res.locals.content = result
      next()
    })
  })
}

exports.deleteReview = (req, res, next) => {
  Review.findOne({ _id: req.params.modReviewId }, (err, review) => {
    if (err) return next(err)
    if (String(review.author) !== String(req.user._id)) {
      const error = new Error('You can only delete your own post.')
      error.status = 403
      next(error)
    }
    Review.findByIdAndDelete(req.params.modReviewId, (err, result) => {
      if (err) return next(err)
      res.locals.msg = 'Module review deleted successfully.'
      res.locals.content = result
      next()
    })
  })
}

exports.searchReviews = (req, res, next) => {
  const mergereviews = (arr1, arr2) => arr1.filter(rev1 => !arr2.find(rev2 => String(rev1._id) === String(rev2._id))).concat(arr2)

  // search using text index
  Review.find({ $text: { $search: req.query.q } })
    .populate('author')
    .exec((err, reviews) => {
      if (err) return next(err)
      // partial search on first word only
      Review.find({ $or: [{ title: { $regex: req.query.q.split(' ')[0] } }, { content: { $regex: req.query.q.split(' ')[0] } }] })
        .populate('author')
        .exec((err, result) => {
          if (err) return next(err)
          res.locals.content = mergereviews(reviews, result)
          next()
        })
    })
}

exports.vote = (req, res, next) => {
  Review.findOne({ _id: req.params.modReviewId }, (err, review) => {
    if (err) return next(err)

    const voteArray = review[res.locals.vote]
    let newArray
    let message

    if (voteArray.includes(req.user._id)) {
      // Take back up/downvote
      newArray = voteArray.filter(item => String(item) !== String(req.user._id))
      message = `Module review ${res.locals.vote} removed.`
    } else {
      // Up/downvote
      newArray = voteArray.slice()
      newArray.push(req.user._id)
      message = `Module review ${res.locals.vote} added.`
    }

    review.updateVotes(res.locals.vote, newArray, (err, result) => {
      if (err) return next(err)
      res.locals.msg = message
      res.locals.content = result.votes
      next()
    })
  })
}
