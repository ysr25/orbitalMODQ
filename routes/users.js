const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const users = require('../controllers/users')

const loggedInOnly = require('./auth').loggedInOnly
const loggedOutOnly = require('./auth').loggedOutOnly
const sendResponse = require('./utils').sendResponse

router.get('/', sendResponse)

// Get user details
router.get('/view',
  loggedInOnly,
  users.getUser,
  sendResponse
)

// Edit user details
router.patch('/edit',
  loggedInOnly,
  users.editUser,
  sendResponse
)

// Create new user
router.post('/signup',
  users.createUser,
  sendResponse
)

// Sign user in
router.post('/login',
  loggedOutOnly,
  users.signIn,
  sendResponse
)

// Sign user in with google
router.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

router.get(
  '/login/google/redirect',
  passport.authenticate('google'),
  users.googleRedirect
)

// Sign user out
router.post('/logout',
  loggedInOnly,
  users.signOut,
  sendResponse
)

// Delete user account
router.delete('/delete',
  loggedInOnly,
  users.deleteUser,
  sendResponse
)

module.exports = router
