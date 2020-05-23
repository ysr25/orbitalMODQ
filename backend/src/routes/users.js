const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/UserModel");

// GET Request
router.get('/', (req, res, next) => {
    console.log('Handling GET request for user')
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json("Error: " + err));
});

// POST Request
router.post('/add', (req, res, next) => {
    const newUser = new User({
        _id: new mongoose.Types.ObjectId,
        username: req.body.username,
        course: req.body.course,
        yearOfStudy: req.body.yearOfStudy
    });
    newUser.save()
        .then(() => res.json('User added.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;