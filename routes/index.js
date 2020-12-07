const express = require("express");
const router = express.Router();

const users = require("./users");
const reviews = require("./reviews");

const sendResponse = require("./utils").sendResponse;

// Check if logged in
router.get("/", sendResponse);

router.use("/users", users);
router.use("/reviews", reviews);

module.exports = router;
