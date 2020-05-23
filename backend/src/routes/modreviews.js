const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ModReview = require('../models/ModReviewModel');

// GET Request for ALL mod reviews
router.get("/", (req, res, next) => {
  console.log("Handling GET request for user");
  ModReview.find()
    .then((modreviews) => res.json(modreviews))
    .catch((err) => res.status(400).json("Error: " + err));
});

// GET Request for specific review
router.get('/:modReviewId', (req, res, next) => {
    ModReview.findById(req.params.modReviewId)
    .then((modReview) => res.json(modReview))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Post Request
router.post("/add", (req, res, next) => {
  const newModReview = new ModReview({
    _id: new mongoose.Types.ObjectId(),
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    moduleCode: req.body.moduleCode
  });
  newModReview
    .save()
    .then(() => res.json("Mod Review added."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// UPDATE Request
router.patch('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling PATCH (UPDATE FUNCTION) requests to /modreviews, i.e. post update'
    });
});

// DELETE Request
router.delete("/:modReviewId", (req, res, next) => {
  ModReview.findByIdAndDelete(req.params.modReviewId)
    .then((modReview) => res.json('module deleted: ' + modReview))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;