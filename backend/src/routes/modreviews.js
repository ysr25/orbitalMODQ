const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ModReview = require("../models/ModReviewModel");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const AnonymousStrategy = require("passport-anonymous").Strategy;
const User = require("../models/UserModel");

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

passport.use(new AnonymousStrategy());

const loggedInOnly = (req, res, next) => {
  console.log("checking if logged in");
  if (req.isAuthenticated()) next();
  else res.json({ msg: "you need to be logged in to do this" });
};

const loggedOutOnly = (req, res, next) => {
  console.log("checking if logged out");
  if (req.isUnauthenticated()) next();
  else res.json({ msg: "you need to be logged out to do this" });
};

// GET Request for ALL mod reviews
router.get("/view/all", (req, res, next) => {
  console.log("Handling GET request for ALL mod reviews");
  ModReview.find()
    .populate("author")
    .then((modreviews) => res.json(modreviews))
    .catch((err) => res.status(400).json("Error: " + err));
});

// GET Request for specific review
router.get("/view/:modReviewId", (req, res, next) => {
  console.log("Handling GET request for specific mod review");
  ModReview.findById(req.params.modReviewId)
    .populate("author")
    .then((modReview) => res.json(modReview))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Post Request
router.post(
  "/newpost",
  passport.authenticate(["local", "anonymous"]),
  (req, res, next) => {
    console.log("Handling POST request for mod review");
    let newPostId = new mongoose.Types.ObjectId();
    let newPost = {
      _id: newPostId,
      title: req.body.title,
      content: req.body.content,
      moduleCode: req.body.moduleCode,
    };
    if (req.user) {
      newPost.author = req.user._id;
      newPost.anonymous = req.body.anonymous;
    } else if (req.body.anonymous) {
      newPost.anonymous = true;
    } else {
      return res.status(400).send("Error: must log in to post unanonymously");
    }
    ModReview.create(newPost)
      .then(() => res.json(newPostId))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

// GET Request to check if user is poster (for edit)
router.get(
  "/checkPoster/:modReviewId",
  passport.authenticate(["local", "anonymous"]),
  (req, res, next) => {
    console.log("Handling GET request for mod review to check poster");
    ModReview.findOne({ _id: req.params.modReviewId })
    .then((modreview) => {
      if (String(modreview.author) === String(req.user._id)) {
        res.sendStatus(200);
      } else {
        res.sendStatus(403); //Forbidden
      }
    })
    .catch(err => res.status(403).json("Error: " + err));
  }
)

// UPDATE Request (MUST ADD USER AUTHENTICATION)
router.patch(
  "/edit/:modReviewId",
  passport.authenticate(["local", "anonymous"]),
  (req, res, next) => {
    console.log("Handling PATCH request for mod review");
    // Double checking (so that users cannot randomly type the link and edit posts)
    ModReview.findOne({ _id: req.params.modReviewId }).then((modreview) => {
      if (String(modreview.author) === String(req.user._id)) {
        const updateOps = { dateEdited: Date.now() };
        for (const ops in req.body) {
          updateOps[ops] = req.body[ops];
        }
        ModReview.updateOne({ _id: req.params.modReviewId }, updateOps)
          .then((modreview) => {
            res.json("Module Review update: " + modreview);
            res.sendStatus(200);
          })
          .catch((err) => res.status(400).json("Error: " + err));
      } else {
        console.log("Error editing post");
      }
    });
  }
);

// DELETE Request (MUST ADD USER AUTHENTICATION)
router.delete(
  "/delete/:modReviewId", 
  passport.authenticate(["local", "anonymous"]),
  (req, res, next) => {
    console.log("Handling DELETE request for specific mod reviews");
    ModReview.findOne({ _id: req.params.modReviewId }).then((modreview) => {
      if (String(modreview.author) === String(req.user._id)) {
      ModReview.findByIdAndDelete(req.params.modReviewId)
        .then((modReview) => res.json("module review deleted: " + modReview))
        .catch((err) => res.status(400).json("Error: " + err));
      } else {
        console.log("Error deleting post");
      }
    });
  }
);

// search for post
router.get("/search", (req, res, next) => {
  ModReview.find({ $text: { $search: req.query.q } })
    .populate("author")
    .then((modreviews) => res.json(modreviews))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
