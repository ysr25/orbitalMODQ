const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const reviews = require('../controllers/reviews')

const loggedInOnly = require('./auth').loggedInOnly
const sendResponse = require('./utils').sendResponse

// Get all module reviews
router.get('/',
  reviews.getAllReviews,
  sendResponse
)

// Search for reviews
router.get('/search',
  reviews.searchReviews,
  sendResponse
)

// Get a specific module review
router.get('/:reviewId',
  reviews.getOneReview,
  sendResponse
)

// Get comments for a specific review
router.get('/:reviewId/comments',
  reviews.getComments,
  sendResponse
)

// Post comment
router.post('/:reviewId/comments',
  loggedInOnly,
  reviews.postComment,
  sendResponse
)

// Post module review
router.post('/',
  passport.authenticate(['local', 'anonymous']),
  reviews.postReview,
  sendResponse
)

// Check if user is poster
router.get('/:reviewId/poster',
  passport.authenticate(['local', 'anonymous']),
  reviews.checkIfUserIsPoster,
  sendResponse
)

// Edit module review
router.patch('/:reviewId',
  loggedInOnly,
  reviews.editReview,
  sendResponse
)

// Delete module review
router.delete('/:reviewId',
  loggedInOnly,
  reviews.deleteReview,
  sendResponse
)

// Upvote review
router.patch('/:reviewId/upvote',
  loggedInOnly,
  (req, res, next) => {
    res.locals.vote = 'upvotes'
    next()
  },
  reviews.vote,
  sendResponse
)

// Downvote review
router.patch('/:reviewId/downvote',
  loggedInOnly,
  (req, res, next) => {
    res.locals.vote = 'downvotes'
    next()
  },
  reviews.vote,
  sendResponse
)

module.exports = router
