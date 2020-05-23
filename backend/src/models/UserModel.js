const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
//default SALT_WORK_FACTOR = 10;

let yearOfStudyOptions = ["matriculatingSoon", "undergrad1", "undergrad2", "undergrad3", "undergrad4", "masters", "phd"];

let UserSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfStudy: {
      type: String,
      required: true,
      enum: yearOfStudyOptions, // drop-down list?
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);