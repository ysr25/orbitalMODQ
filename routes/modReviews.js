const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ModReview = require("../models/ModReviewModel");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const AnonymousStrategy = require("passport-anonymous").Strategy;
const sanitizeHtml = require("sanitize-html");
const User = require("../models/UserModel");
const Comment = require("../models/CommentModel")

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

const loggedInOnly = (req, res, next) => {
  console.log("checking if logged in");
  if (req.isAuthenticated()) next();
  else res.status(403).json({ msg: "You need to be logged in to do this." });
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

// FOR COMMENT FUNCTION for specific review
router.get("/:modReviewId/comments", (req, res, next) => {
  console.log("Handling GET request for COMMENTING on specific mod review ");
  Comments.find((err, comments) => {
    if(err) { res.send(err) }
    res.json(comments)
  });
})

router.post("/:modReviewId/comment", 
passport.authenticate(["local"]), 
(req, res, next) => {
  console.log("Handling POST request for COMMENTING on specific mod review ");
  let newCommentId = new mongoose.Types.ObjectId();
  let newComment = {
    _id: newCommentId,
    content: sanitizeHtml(req.body.content, {
      allowedTags: [ "p", "h1", "h2", "h3", "b", "i", "em", "strong", "blockquote", "a", "li", "ol", "ul" ],
      allowedAttributes: { "a": [ "href" ] },
    }),
    author: req.user._id
  };

  Comment.create(newComment)
      .then(() => res.status(200).json({
        msg: "New comment added successfully.",
        content: newCommentId,
      }))
      .catch((err) => res.status(400).json({ msg: err }));
  }
);

// Post Request
router.post(
  "/newpost",
  passport.authenticate(["local", "anonymous"]),
  (req, res, next) => {
    console.log("Handling POST request for mod review");
    if (!req.body.content) {
      return res.status(400).json({ msg: "Post cannot be empty." })
    }
    let newPostId = new mongoose.Types.ObjectId();
    let newPost = {
      _id: newPostId,
      title: req.body.title,
      content: sanitizeHtml(req.body.content, {
        allowedTags: [ "p", "h1", "h2", "h3", "b", "i", "em", "strong", "blockquote", "a", "li", "ol", "ul" ],
        allowedAttributes: { "a": [ "href" ] },
      }),
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
    if (req.user) {
      ModReview.findOne({ _id: req.params.modReviewId })
      .then((modreview) => {
        if (String(modreview.author) === String(req.user._id)) {
          res.status(200).json({ content: true });
        } else {
          res.status(200).json({ content: false });
        }
      })
      .catch(err => res.status(400).json({ msg: err }));
    } else {
      res.status(200).json({ content: false });
    }
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
        if (!req.body.content) {
          return res.status(400).json({ msg: "Post cannot be empty." })
        }
        const updateOps = { dateEdited: Date.now() };
        for (const ops in req.body) {
          if (ops === "content") {
            req.body.content = sanitizeHtml(req.body.content, {
              allowedTags: [ "p", "h1", "h2", "h3", "b", "i", "em", "strong", "blockquote", "a", "li", "ol", "ul" ],
              allowedAttributes: { "a": [ "href" ] },
            })
          }
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
  let mergereviews = (arr1, arr2) => arr1.filter(rev1 => !arr2.find(rev2 => String(rev1._id) === String(rev2._id)) ).concat(arr2);

  // search using text index
  ModReview.find({ $text: { $search: req.query.q } })
    .populate("author")
    .then(modreviews => {
      // partial search on first word only
      ModReview.find({ $or: [{ title: { $regex: req.query.q.split(' ')[0] }}, { content: { $regex: req.query.q.split(' ')[0] }}] })
        .populate("author")
        .then(modreviews2 => mergereviews(modreviews, modreviews2))
        .then((modreviews) => res.status(200).json({ content: modreviews }))
        .catch((err) => res.status(400).json({ msg: err }));
    })
    .catch((err) => res.status(400).json({ msg: err }));
});

// upvote post
router.patch("/upvote/:modReviewId", loggedInOnly, (req, res, next) => {
  ModReview.findOne({ _id: req.params.modReviewId }).then((modreview) => {
    if (modreview.upvotes.includes(req.user._id)) {
      // take back upvote
      const newArray = modreview.upvotes.filter(item => String(item) !== String(req.user._id));
      modreview.updateUpvotes(newArray, function(err, result) {
        if (!err) {
          return res.status(200).json({ msg: "Module review upvote removed.", content: result.votes});
        }
        res.status(400).json({ msg: err });
      })
    } else {
      // upvote
      const newArray = modreview.upvotes.slice();
      newArray.push(req.user._id);
      modreview.updateUpvotes(newArray, function(err, result) {
        if (!err) {
          return res.status(200).json({ msg: "Module review upvoted.", content: result.votes});
        }
        res.status(400).json({ msg: err });
      })
    }
  })
  .catch((err) => res.status(400).json({ msg: err }));
});

// downvote post
router.patch("/downvote/:modReviewId", loggedInOnly, (req, res, next) => {
  ModReview.findOne({ _id: req.params.modReviewId }).then((modreview) => {
    if (modreview.downvotes.includes(req.user._id)) {
      // take back downvote
      const newArray = modreview.downvotes.filter(item => String(item) !== String(req.user._id));
      modreview.updateDownvotes(newArray, function(err, result) {
        if (!err) {
          return res.status(200).json({ msg: "Module review downvote removed.", content: result.votes});
        }
        res.status(400).json({ msg: err });
      })
    } else {
      // downvote
      const newArray = modreview.downvotes.slice();
      newArray.push(req.user._id);
      modreview.updateDownvotes(newArray, function(err, result) {
        if (!err) {
          return res.status(200).json({ msg: "Module review downvoted.", content: result.votes});
        }
        res.status(400).json({ msg: err });
      })
    }
  })
  .catch((err) => res.status(400).json({ msg: err }));
});

module.exports = router;
