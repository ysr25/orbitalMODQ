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

// Post Request (MUST ADD USER AUTHENTICATION)
router.post(
  "/newpost",
  passport.authenticate(["local", "anonymous"]),
  (req, res, next) => {
    console.log("Handling POST request for mod review");
    let newPostId = new mongoose.Types.ObjectId();
    ModReview.create({
      _id: newPostId,
      author: req.session.passport.user,
      title: req.body.title,
      content: req.body.content,
      moduleCode: req.body.moduleCode,
    })
      .then(() => res.json(newPostId))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

// UPDATE Request (MUST ADD USER AUTHENTICATION)
router.patch("/edit/:modReviewId", passport.authenticate(["local"]),
(req, res, next) => {
  console.log("Handling PATCH request for mod review");
  const updateOps = { dateEdited: Date.now() };
  for (const ops in req.body) {
    updateOps[ops] = req.body[ops];
  }
  ModReview.updateOne({ _id: req.params.modReviewId }, updateOps)
    .then((modreview) => res.json("Module Review update: " + modreview))
    .catch((err) => res.status(400).json("Error: " + err));
});

// DELETE Request (MUST ADD USER AUTHENTICATION)
router.delete("/delete/:modReviewId", (req, res, next) => {
  console.log("Handling DELETE request for specific mod reviews");
  ModReview.findByIdAndDelete(req.params.modReviewId)
    .then((modReview) => res.json("module review deleted: " + modReview))
    .catch((err) => res.status(400).json("Error: " + err));
});

// search for post
router.get("/search", (req, res, next) => {
  ModReview.find({ $text: { $search: req.query.q } })
    .populate("author")
    .then((modreviews) => res.json(modreviews))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
