const mongoose = require('mongoose')
const settings = require('./settings')

const uri = settings.mongoUrl
const options = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect(uri, options)
  .then(console.log('Connected to MongoDB'))
  .catch((err) => console.error(err))

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error')
)

module.exports = mongoose
