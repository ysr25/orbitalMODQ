require("dotenv").config();

const settings = {};

settings.development = {
  mongoUrl: process.env.MONGO_URL,
  sessionSecret: process.env.SESSION_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  clientUrl: "http://localhost:3000/",
};

settings.production = {
  mongoUrl: process.env.MONGO_URL,
  sessionSecret: process.env.SESSION_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  clientUrl: "/",
};

settings.test = {
  mongoUrl: "",
  sessionSecret: "",
  googleClientId: "",
  googleClientSecret: "",
  clientUrl: "http://localhost:3000/",
};

module.exports = settings[process.env.NODE_ENV];
