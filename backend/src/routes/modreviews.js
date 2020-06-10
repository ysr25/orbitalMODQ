const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ModReview = require('../models/ModReviewModel');

// GET Request for ALL mod reviews
router.get("/view/all", (req, res, next) => {
  console.log("Handling GET request for ALL mod reviews");
  ModReview.find()
    .populate('author')
    .then((modreviews) => res.json(modreviews))
    .catch((err) => res.status(400).json("Error: " + err));
});

// GET Request for specific review
router.get('/view/:modReviewId', (req, res, next) => {
    console.log("Handling GET request for specific mod review");
    ModReview.findById(req.params.modReviewId)
    .populate('author')
    .then((modReview) => res.json(modReview))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Post Request (MUST ADD USER AUTHENTICATION)
router.post("/newpost", (req, res, next) => {
 console.log("Handling POST request for mod review");
 ModReview.create({
    _id: new mongoose.Types.ObjectId(),
    author: req.session.passport.user,
    title: req.body.title,
    content: req.body.content,
    moduleCode: req.body.moduleCode
  })
    .then(() => res.json("Mod Review added."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// UPDATE Request (MUST ADD USER AUTHENTICATION)
router.patch("/edit/:modReviewId", (req, res, next) => {
  console.log("Handling PATCH request for mod review");
  const updateOps = {dateEdited: Date.now()};
  for(const ops in req.body) {
    updateOps[ops] = req.body[ops];
  }
  ModReview.updateOne({_id: req.params.modReviewId}, updateOps)
    .then((modreview) => res.json('Module Review update: ' + modreview))
    .catch((err) => res.status(400).json('Error: ' + err))
});

// DELETE Request (MUST ADD USER AUTHENTICATION)
router.delete("/delete/:modReviewId", (req, res, next) => {
  console.log("Handling DELETE request for specific mod reviews");
  ModReview.findByIdAndDelete(req.params.modReviewId)
    .then((modReview) => res.json('module review deleted: ' + modReview))
    .catch((err) => res.status(400).json("Error: " + err))
});

// upvote or downvote
router.patch("/vote/:modReviewId", (req, res, next) => {
  //tbd
});

module.exports = router;