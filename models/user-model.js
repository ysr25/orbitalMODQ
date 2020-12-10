const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const saltRounds = 12;

const yearOfStudy = [
  "matriculatingSoon",
  "undergraduate",
  "masters",
  "doctorate",
  "others",
  "notSelected",
];

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      // Not required if signing up with Google
      type: String,
      trim: true,
      minlength: 6,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfStudy: {
      type: String,
      required: true,
      enum: yearOfStudy,
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

UserSchema.methods.comparePassword = function (password, next) {
  const user = this;

  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      return next(err);
    } else if (result) {
      return next(null, user);
    } else {
      return next(null, false, "Incorrect password, please try again.");
    }
  });
};

// Reused from http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    return next();
  });
});

UserSchema.methods.saveUser = function (next) {
  return this.save(function (err, user) {
    if (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        const error = new Error("Sorry, that username/email has been taken.");
        error.status = 400;
        return next(error);
      } else {
        return next(err); // Some other kind of error
      }
    }
    return next(null, user);
  });
};

module.exports = mongoose.model("User", UserSchema);
