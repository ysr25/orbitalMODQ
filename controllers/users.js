const passport = require("../config/passport");
const User = require("../models/user-model");

const redirectUrl = require("../config/settings").clientUrl;

exports.getUser = (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return next(err);
    res.locals.content = user;
    return next();
  });
};

exports.editUser = (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return next(err);

    if (user.googleId) {
      // Can only edit yearOfStudy and course
      if (req.body.yearOfStudy) user.yearOfStudy = req.body.yearOfStudy;
      if (req.body.course) user.course = req.body.course;
    } else {
      // Can edit any field
      for (const field in req.body) {
        user[field] = req.body[field];
      }
    }
    user.saveUser((err, user) => {
      if (err) return next(err);
      res.locals.msg = "User details updated successfully.";
      res.locals.content = user;
      return next();
    });
  });
};

exports.createUser = (req, res, next) => {
  if (!req.body.email) {
    const error = new Error("Email is required.");
    error.status = 400;
    return next(error);
  } else if (req.body.email.indexOf("@") < 0) {
    const error = new Error("Please enter a valid email address.");
    error.status = 400;
    return next(error);
  } else if (!req.body.password) {
    const error = new Error("Password is required.");
    error.status = 400;
    return next(error);
  }

  const user = new User({
    username: req.body.username,
    course: req.body.course,
    yearOfStudy: req.body.yearOfStudy,
    password: req.body.password,
    email: req.body.email,
  });
  user.saveUser((err, user) => {
    if (err) return next(err);
    req.login(user, (err) => {
      if (err) return next(err);
      res.locals.msg = "Logged in successfully.";
      res.locals.content = user;
      return next();
    });
  });
};

exports.signIn = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      const error = new Error(info);
      error.status = 403;
      return next(error);
    }
    req.login(user, (err) => {
      if (err) return next(err);
      res.locals.msg = "Logged in successfully.";
      return next();
    });
  })(req, res, next);
};

exports.googleRedirect = (req, res) => {
  if (
    req.user.course === "notSelected" ||
    req.user.yearOfStudy === "notSelected"
  ) {
    res.redirect(redirectUrl + "users/edit/");
  } else {
    res.redirect(redirectUrl);
  }
};

exports.signOut = (req, res, next) => {
  req.logout();
  res.locals.msg = "Logged out successfully.";
  return next();
};

exports.deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) return next(err);
    res.locals.msg = "User deleted successfully.";
    return next();
  });
};
