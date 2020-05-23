const bcrypt = require('bcrypt'); // Used to encrpyt passwords with hashing
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/UserModel");
const saltRounds = 10; // default value used

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

// POST Request, creating new user
router.post('/signup', (req, res, next) => {
    console.log("Handling POST request for user (CREATION)");
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    User.create({     
        _id: new mongoose.Types.ObjectId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        course: req.body.course,
        yearOfStudy: req.body.yearOfStudy,
        password: hash,
        email: req.body.email
    })
    .then(data => res.json('User added: ' + data))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST Request, user sign in verification
router.post('/login', (req, res, next) => {
    User.findOne({
        username: req.body.username
    })
    .then(user => {
        if(!user) { res.json('No user with entered username found, please create an account.') }
        else { 
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(result) { res.json('Correct password entered') }
                else { res.json('Incorrect password, please try again.') }
            });
        }
    })
});

router.delete('/delete/:userId', (req, res, next) => {
    console.log("Handling DELETE request for SPECIFIC user");
    User.findByIdAndDelete(req.params.userId)
        .then(() => res.json('User deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;