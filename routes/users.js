const bcrypt = require("bcryptjs"); // Used to encrpyt passwords with hashing
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
            msg:
              "No user with entered username found, please create an account.",
          });
        } else {
          bcrypt.compare(password, user.password)
          .then(res => {
            if (res) {
              return done(null, user);
            } else {
              return done(null, false, {
                msg: "Incorrect password, please try again.",
              });
            }
          })
          .catch(err => done(err));
        }
      })
      .catch((err) => console.log(err));
  })
);

const loggedInOnly = (req, res, next) => {
  console.log("checking if logged in");
  if (req.isAuthenticated()) next();
  else res.status(403).json({ msg: "You need to be logged in to do this." });
};

const loggedOutOnly = (req, res, next) => {
  console.log("checking if logged out");
  if (req.isUnauthenticated()) next();
  else res.status(403).json({ msg: "You need to be logged out to do this." });
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
      res.status(200).json({ content: req.user })
  } else {
      res.status(200).json({ content: null })
  }
})

// At this phase, for admin -- eventually can implement to let others view user page
router.get("/:userId", (req, res, next) => {
  console.log("Handling GET request for SPECIFIC user");
  User.findById(req.params.userId)
    .then((user) => res.status(200).json({ content: user }))
    .catch((err) => res.status(400).json({ msg: err }));
});

// POST Request, creating new user
router.post("/signup", (req, res, next) => {
  console.log("Handling POST request for user (CREATION)");
  if (req.body.email.indexOf("@") <= 0) {
    return res.status(400).json({ msg: "Please enter a valid email address." });
  }
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
          res.status(200).json({ msg: "Logged in successfully." });
        }
      });
    })
    .catch((err) => {
      if (err.name === "MongoError" && err.code === 11000) {
        res.status(400).json({ msg: "Sorry, that username/email has been taken." });
      } else {
        console.log(err);
        res.status(400).json({ msg: err }); // Some other kind of error
      }
    });
});

// POST Request, user sign in verification
router.post("/login", loggedOutOnly, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log(user);
    if (err) { 
      return next(err);
    } if (!user) {
      res.status(403).json(info); 
    } else {
      req.login(user, (err) => {
        if (err) {
          return next(err);
        } else {
          res.status(200).json({ msg: "Logged in successfully." });
        }
      });
    }
  })(req, res, next);
});

// POST Request, user sign out verification
router.post("/logout", loggedInOnly, (req, res, next) => {
  console.log("Handling POST request to /logout");
  req.logout();
  res.status(200).json({ msg: "Logged out successfully." })
});

// FOR ADMIN
router.delete("/delete/:userId", (req, res, next) => {
  console.log("Handling DELETE request for SPECIFIC user");
  User.findByIdAndDelete(req.params.userId)
    .then(() => res.status(200).json({ msg: "User deleted successfully." }))
    .catch((err) => res.status(400).json({ msg: err }));
});

module.exports = router;
