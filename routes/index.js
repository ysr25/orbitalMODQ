const express = require("express");
const router = express.Router();

const users = require("./users");
const reviews = require("./reviews");

const sendResponse = require("./utils").sendResponse;

// Check if logged in
router.get("/", sendResponse);

router.use("/users", users);
router.use("/reviews", reviews);

// Reaches this when no /api routes are found
router.use((req, res, next) => {
  const error = new Error("No endpoint (route) found");
  error.status = 404;
  next(error);
});

// Reaches this when other parts of code throws error
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    isLoggedIn: res.locals.isLoggedIn,
    message: err.message || "An unknown error occured",
  });
});

module.exports = router;
