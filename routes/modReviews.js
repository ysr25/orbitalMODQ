const bcrypt = require("bcryptjs");
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

passport.use(new AnonymousStrategy());

const loggedOutOnly = (req, res, next) => {
  console.log("checking if logged out");
  if (req.isUnauthenticated()) next();
  else res.status(403).json({ msg: "You need to be logged out to do this." });
};

// GET Request for ALL mod reviews
router.get("/view/all", (req, res, next) => {
  console.log("Handling GET request for ALL mod reviews");
  ModReview.find()
    .populate("author")
    .then((modreviews) => res.status(200).json({ content: modreviews }))
    .catch((err) => res.status(400).json({ msg: err }));
});

// GET Request for specific review
router.get("/view/:modReviewId", (req, res, next) => {
  console.log("Handling GET request for specific mod review");
  ModReview.findById(req.params.modReviewId)
    .populate("author")
    .then((modReview) => res.status(200).json({ content: modReview }))
    .catch((err) => res.status(400).json({ msg: err }));
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
      return res.status(403).json({ msg: "Please log in or choose to post anonymously."});
    }
    ModReview.create(newPost)
      .then(() => res.status(200).json({
        msg: "New module review created successfully.",
        content: newPostId,
      }))
      .catch((err) => res.status(400).json({ msg: err }));
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
        res.status(200).json({ content: true });
      } else {
        res.status(200).json({ content: false });
      }
    })
    .catch(err => res.status(400).json({ msg: err }));
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
            res.status(200).json({ 
              msg: "Module review updated successfully.",
              content: modreview, 
            });
          })
          .catch((err) => res.status(400).json({ msg: err }));
      } else {
        res.status(403).json({ msg: "You can only edit your own post." });
      }
    })
    .catch((err) => res.status(400).json({ msg: err }));
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
        .then((modReview) => res.status(200).json({
            msg: "Module review deleted successfully.",
            content: modReview,
        }))
        .catch((err) => res.status(400).json({ msg: err }));
      } else {
        res.status(403).json({ msg: "You can only delete your own post." });
      }
    })
    .catch((err) => res.status(400).json({ msg: err }));
  }
);

// search for post
router.get("/search", (req, res, next) => {
  ModReview.find({ $text: { $search: req.query.q } })
    .populate("author")
    .then((modreviews) => res.status(200).json({ content: modreviews }))
    .catch((err) => res.status(400).json({ msg: err }));
});

module.exports = router;
