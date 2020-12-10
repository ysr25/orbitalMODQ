const settings = {};

settings.development = {
  serverUrl: "http://localhost:3001/",
};

settings.production = {
  serverUrl: "/",
};

settings.test = {
  serverUrl: "http://localhost:3001/",
};

module.exports = settings[process.env.NODE_ENV];
