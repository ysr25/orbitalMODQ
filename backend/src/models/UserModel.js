const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let yearOfStudyOptions = ["matriculatingSoon", "undergrad1", "undergrad2", "undergrad3", "undergrad4", "masters", "phd"];

let userSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
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
    // firstName: {
    //   type: String,
    //   required: true,
    // },
    // lastName: {
    //   type: String,
    //   required: true,
    // },
    // email: {
    //   type: String,
    //   required: true,
    // },
    // password: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   maxlength: 100,
    // }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);