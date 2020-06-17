const bcrypt = require("bcrypt"); // Used to encrpyt passwords with hashing
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/UserModel");
const saltRounds = 12; // default value used

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message:
              "No user with entered username found, please create an account.",
          });
        } else if (!user.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect password, please try again.",
          });
        } else {
          return done(null, user);
        }
      })
      .catch((err) => done(err));
  })
);

const loggedInOnly = (req, res, next) => {
  console.log("checking if logged in");
  if (req.isAuthenticated()) next();
  else res.json({msg: "you need to be logged in to do this"});
};

const loggedOutOnly = (req, res, next) => {
  console.log("checking if logged out");
  if (req.isUnauthenticated()) next();
  else res.json({msg: "you need to be logged out to do this"});
};

// // GET Request -- For admin
// router.get("/", (req, res, next) => {
//   console.log("Handling GET request for user");
//   User.find()
//     .then((users) => res.json(users))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

router.get('/', (req, res, next) => {
  console.log("GET request to /")
  console.log(req.user)
  if (req.user) {
      res.json({ user: req.user })
  } else {
      res.json({ user: null })
  }
})

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
router.post("/signup", (req, res, next) => {
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
    email: req.body.email,
  })
    .then((user) => {
      req.login(user, (err) => {
        if (err) {
          return next(err);
        } else {
          res.status(200).json({msg: "logged in"});
        }
      });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        res.json({msg: "Sorry, that username has been taken."});
      } else next(err);
    });
});

// POST Request, user sign in verification
router.post("/login", loggedOutOnly,
  passport.authenticate("local", {
    failureFlash: true,
  }),
  (req, res) => {
    res.sendStatus(200);
  }
);

// POST Request, user sign out verification
router.post("/logout", loggedInOnly, (req, res, next) => {
  console.log("Handling POST request to /logout");
  req.logout();
  res.send({msg: 'logging out'})
});

// FOR ADMIN
router.delete("/delete/:userId", (req, res, next) => {
  console.log("Handling DELETE request for SPECIFIC user");
  User.findByIdAndDelete(req.params.userId)
    .then(() => res.json("User deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
