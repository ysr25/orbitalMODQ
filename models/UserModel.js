const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const yearOfStudyOptions = [
  "matriculatingSoon",
  "undergrad",
  "masters",
  "doctorate",
  "others",
  "notSelected"
];

let UserSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      //minlength: 5,
    },
    password: {
      type: String,
      //required: true,
      trim: true,
     // minlength: 6
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
      unique: true,
    },
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
