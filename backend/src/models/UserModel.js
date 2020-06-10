const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const yearOfStudyOptions = ["matriculatingSoon", 
  "undergrad",
  "masters", 
  "doctorate", "others"]

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

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);