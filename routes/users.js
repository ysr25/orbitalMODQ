const bcrypt = require('bcryptjs') // Used to encrpyt passwords with hashing
const express = require('express')
const router = express.Router()
// const mongoose = require("mongoose");
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/UserModel')
// const saltRounds = 12; // default value used
const userController = require('../controllers/userController')

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            msg:
              'No user with entered username found, please create an account.'
          })
        } else {
          bcrypt.compare(password, user.password)
            .then(res => {
              if (res) {
                return done(null, user)
              } else {
                return done(null, false, {
                  msg: 'Incorrect password, please try again.'
                })
              }
            })
            .catch(err => done(err))
        }
      })
      .catch((err) => console.log(err))
  })
)

const loggedInOnly = (req, res, next) => {
  console.log('checking if logged in')
  if (req.isAuthenticated()) next()
  else res.status(403).json({ msg: 'You need to be logged in to do this.' })
}

const loggedOutOnly = (req, res, next) => {
  console.log('checking if logged out')
  if (req.isUnauthenticated()) next()
  else res.status(403).json({ msg: 'You need to be logged out to do this.' })
}

// // GET Request -- For admin
// router.get("/", (req, res, next) => {
//   console.log("Handling GET request for user");
//   User.find()
//     .then((users) => res.json(users))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

router.get('/', userController.checkIfLoggedIn)

// GET Request, view user page
router.get('/view', loggedInOnly, userController.getUser)

// PATCH Request, edit user details
router.patch('/edit', loggedInOnly, userController.editUser)

// POST Request, creating new user
router.post('/signup', userController.postUser)

// POST Request, user sign in verification
router.post('/login', loggedOutOnly, userController.signIn)

// POST Request, user sign in verification with google
router.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

router.get(
  '/login/google/redirect',
  passport.authenticate('google'),
  userController.googleRedirect
)

// POST Request, user sign out verification
router.post('/logout', loggedInOnly, userController.signOut)

// FOR ADMIN
router.delete('/delete/:userId', userController.deleteUser)

module.exports = router
