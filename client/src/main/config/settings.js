const settings = {}

settings.development = {
  serverUrl: 'http://localhost:3001/'
}

settings.production = {
  serverUrl: '/'
}

module.exports = settings[process.env.NODE_ENV]