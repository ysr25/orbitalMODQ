const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const AnonymousStrategy = require('passport-anonymous').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

const User = require('../models/user-model')
const settings = require('./settings')

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return next(err)
      if (!user) {
        return next(null, false, 'No user with entered username found.')
      }
      user.comparePassword(password, next)
    })
  })
)

passport.use(new AnonymousStrategy())

passport.use(
  new GoogleStrategy({
    clientID: settings.googleClientId,
    clientSecret: settings.googleClientSecret,
    callbackURL: '/api/users/login/google/redirect'
  }, (accessToken, refreshToken, profile, next) => {
    User.findOne({ googleId: profile.id }, (err, user) => {
      if (err) return next(err)
      if (user) return next(null, user)

      // User does not exist, create new user
      User.create({
        username: profile._json.name,
        course: 'notSelected',
        yearOfStudy: 'notSelected',
        email: profile._json.email,
        googleId: profile.id
      }, (err, user) => {
        if (err) return next(err)
        next(null, user)
      })
    })
  })
)

passport.serializeUser((user, next) => {
  next(null, user._id)
})

passport.deserializeUser((id, next) => {
  User.findById(id, (err, user) => {
    if (err) return next(err)
    next(null, user)
  })
})

module.exports = passport
