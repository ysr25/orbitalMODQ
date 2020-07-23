const cors = require("cors");
const path = require("path");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const router = express.Router();
const User = require("./models/UserModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Assigning directory to respective var names
const usersRoutes = require("./routes/users");
const modReviewRoutes = require("./routes/modReviews");

require("dotenv").config();
const app = express();

// mongoose connection
let uri = process.env.MONGO_URL;
let options = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(uri, options).catch((err) => console.log(err.reason));
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

// express session (for logging in and out)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // expires in 1 hour
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }), // use existing connection
  })
);

// app.use MIDDLEWARES

// passport (for logging in and out)
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/users/login/google/redirect",
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then(user => {
      if (user) {
        // user exists
        done(null, user);
      } else {
        // user does not exist, create new user
        User.create({ 
          _id: new mongoose.Types.ObjectId(),
          username: profile._json.name,
          password: "",
          course: "notSelected",
          yearOfStudy: "notSelected",
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          email: profile._json.email,
          googleId: profile.id,
        })
        .then(user => done(null, user))
        .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      return done(err);
    } else {
      done(null, user);
    }
  });
});

// for restricting domain(?)
// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true,
// };
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

// Routes for handling requests (for endpoints)
app.use("/api/users", usersRoutes);
app.use("/api/modReviews", modReviewRoutes);

// for heroku deployment
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// // Reaches this when no routes are found
// app.use((req, res, next) => {
//   const error = new Error("No endpoint (route) found");
//   error.status = 404;
//   next(error);
// });

// // Reaches this when other parts of code throws error
// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// });

module.exports = app;