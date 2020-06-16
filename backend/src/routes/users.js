const bcrypt = require('bcrypt'); // Used to encrpyt passwords with hashing
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/UserModel");
const saltRounds = 12; // default value used

passport.use(new LocalStrategy((username, password, done) => {
    User
    .findOne({ username: username })
    .then(user => {
        if (!user) { 
            return done(null, false, {message: 'No user with entered username found, please create an account.'});
        } else if (!user.validPassword(password)) {
            return done(null, false, {message: 'Incorrect password, please try again.'});
        } else {
            return done(null, user);
        }
    })
    .catch(err => done(err));
}));

const loggedOutOnly = (req, res, next) => {
    if (req.isUnauthenticated()) next();
    else res.redirect("/");
  };

// GET Request -- For admin
router.get('/', (req, res, next) => {
    console.log('Handling GET request for user')
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json("Error: " + err));
});

// At this phase, for admin -- eventually can implement to let others view user page
router.get("/:userId", (req, res, next) => {
  console.log("Handling GET request for SPECIFIC user");
  User.findById(req.params.userId)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Register View
router.get("/signup", loggedOutOnly, (req, res) => {
res.render("signup");
});

// POST Request, creating new user
router.post('/signup', (req, res, next) => {
    console.log("Handling POST request for user (CREATION)");
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    User.create({     
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        course: req.body.course,
        yearOfStudy: req.body.yearOfStudy,
        password: hash,
        email: req.body.email
    })
    .then(user => req.login(user, err => {
        if (err) next(err);
        else res.redirect("/");
    }))
    .catch(err => {
        if(err.name == "ValidationError") {
            req.flash("Sorry, that username has been taken.");
            res.redirect("/register");
        } else next(err);
    })
});

// POST Request, user sign in verification
router.post('/login', 
    passport.authenticate('local', {
        successRedirect: "/", 
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res) => {
        res.sendStatus(200);
});

// POST Request, user sign out verification
router.post('/logout', (req, res, next) => {
    req.logout();
    res.sendStatus(200);
});

// FOR ADMIN
router.delete('/delete/:userId', (req, res, next) => {
    console.log("Handling DELETE request for SPECIFIC user");
    User.findByIdAndDelete(req.params.userId)
        .then(() => res.json('User deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;