const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const yearOfStudyOptions = [
  'matriculatingSoon',
  'undergrad',
  'masters',
  'doctorate',
  'others',
  'notSelected'
]

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
      // minlength: 5,
    },
    password: {
      type: String,
      // required: true,
      trim: true
      // minlength: 6
    },
    course: {
      type: String,
      required: true,
      trim: true
    },
    yearOfStudy: {
      type: String,
      required: true,
      enum: yearOfStudyOptions // drop-down list?
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    googleId: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

UserSchema.methods.comparePassword = function (password, next) {
  const user = this

  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      return next(err)
    } else if (result) {
      return next(null, user)
    } else {
      return next(null, false, {
        msg: 'Incorrect password, please try again.'
      })
    }
  })
}

UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)
