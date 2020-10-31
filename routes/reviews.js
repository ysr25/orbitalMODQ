const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const reviews = require('../controllers/reviews')

const loggedInOnly = require('./auth').loggedInOnly
const sendResponse = require('./utils').sendResponse

// Get all module reviews
router.get('/view/all',
  reviews.getAllReviews,
  sendResponse
)

// Get a specific module review
router.get('/view/:modReviewId',
  reviews.getOneReview,
  sendResponse
)

// Get comments for a specific review
router.get('/view/:modReviewId/comments',
  reviews.getComments,
  sendResponse
)

// Post comment
router.post('/:modReviewId/comment',
  loggedInOnly,
  reviews.postComment,
  sendResponse
)

// Post module review
router.post(
  '/newpost',
  passport.authenticate(['local', 'anonymous']),
  reviews.postReview,
  sendResponse
)

// Check if user is poster
router.get(
  '/checkPoster/:modReviewId',
  passport.authenticate(['local', 'anonymous']),
  reviews.checkIfUserIsPoster,
  sendResponse
)

// Edit module review
router.patch(
  '/edit/:modReviewId',
  loggedInOnly,
  reviews.editReview,
  sendResponse
)

// Delete module review
router.delete(
  '/delete/:modReviewId',
  loggedInOnly,
  reviews.deleteReview,
  sendResponse
)

// Search for reviews
router.get('/search',
  reviews.searchReviews,
  sendResponse
)

// Upvote review
router.patch('/upvote/:modReviewId',
  loggedInOnly,
  (req, res, next) => {
    res.locals.vote = 'upvotes'
    next()
  },
  reviews.vote,
  sendResponse
)

// Downvote review
router.patch('/downvote/:modReviewId',
  loggedInOnly,
  (req, res, next) => {
    res.locals.vote = 'downvotes'
    next()
  },
  reviews.vote,
  sendResponse
)

module.exports = router
