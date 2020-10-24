const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const modReviewController = require('../controllers/modReviewController')

const loggedInOnly = (req, res, next) => {
  console.log('checking if logged in')
  if (req.isAuthenticated()) next()
  else res.status(403).json({ msg: 'You need to be logged in to do this.' })
}

// GET Request for ALL mod reviews
router.get('/view/all', modReviewController.getAllReviews)

// GET Request for specific review
router.get('/view/:modReviewId', modReviewController.getOneReview)

// FOR COMMENT FUNCTION for specific review
router.get('/view/:modReviewId/comments', modReviewController.getComments)

router.post('/:modReviewId/comment', loggedInOnly, modReviewController.postComment)

// Post Request
router.post(
  '/newpost',
  passport.authenticate(['local', 'anonymous']),
  modReviewController.postReview
)

// GET Request to check if user is poster (for edit)
router.get(
  '/checkPoster/:modReviewId',
  passport.authenticate(['local', 'anonymous']),
  modReviewController.checkIfUserIsPoster
)

// UPDATE Request (MUST ADD USER AUTHENTICATION)
router.patch(
  '/edit/:modReviewId',
  loggedInOnly,
  modReviewController.editReview
)

// DELETE Request (MUST ADD USER AUTHENTICATION)
router.delete(
  '/delete/:modReviewId',
  loggedInOnly,
  modReviewController.deleteReview
)

// search for post
router.get('/search', modReviewController.searchReviews)

// upvote post
router.patch('/upvote/:modReviewId', loggedInOnly, modReviewController.upvoteReview)

// downvote post
router.patch('/downvote/:modReviewId', loggedInOnly, modReviewController.downvoteReview)

module.exports = router
