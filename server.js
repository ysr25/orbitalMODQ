const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");
const path = require("path");

const settings = require("./config/settings");
const mongoose = require("./config/mongoose");
const passport = require("./config/passport");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: settings.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hour
    },
    // Uses existing connection
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Logging routes
app.use((req, res, next) => {
  console.log(req.method, "request to", req.originalUrl);
  next();
});

// Check if user is logged in
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.isAuthenticated();
  console.log("isLoggedIn: ", res.locals.isLoggedIn);
  next();
});

// Routes
app.use("/api", routes);

// Heroku deployment
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
