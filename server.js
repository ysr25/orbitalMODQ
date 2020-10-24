const cors = require('cors')
const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const settings = require('./config/settings')
const mongoose = require('./config/mongoose')
const passport = require('./config/passport')

const users = require('./routes/users')
const moduleReviews = require('./routes/modReviews')

const app = express()

app.use(cors())
app.use(express.json())

app.use(
  session({
    secret: settings.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000 // 1 hour
    },
    // Uses existing connection
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
)

app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api/users', users)
app.use('/api/modReviews', moduleReviews)

// Reaches this when no routes are found
app.use((req, res, next) => {
  const error = new Error('No endpoint (route) found')
  error.status = 404
  next(error)
})

// Reaches this when other parts of code throws error
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      status: error.status,
      message: error.message
    }
  })
})

// Heroku deployment
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

const port = 3001

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
