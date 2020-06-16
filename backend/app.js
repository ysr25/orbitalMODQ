const cors = require("cors");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const router = express.Router();
const User = require("./src/models/UserModel");

require("dotenv").config();
const app = express();

// mongoose connection
let uri = process.env.MONGO_URL;
let options = {useNewUrlParser: true, useUnifiedTopology: true};

mongoose.connect(uri, options).catch(err => console.log(err.reason));
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// express session (for logging in and out)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 // expires in 1 hour
    }, 
    store: new MongoStore({mongooseConnection: mongoose.connection}) // use existing connection
}));

// passport (for logging in and out)
app.use(passport.initialize());
app.use(passport.session());

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

// Routes for handling requests (for endpoints)
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.json());

// Assigning directory to respective var names
const usersRoutes = require('./src/routes/users');
const modReviewRoutes = require('./src/routes/modReviews');

app.use('/users', usersRoutes);
app.use('/modReviews', modReviewRoutes);

// Reaches this when no routes are found
app.use((req, res, next) => {
    const error = new Error('No endpoint (route) found');
    error.status = 404;
    next(error);
})

// Reaches this when other parts of code throws error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;