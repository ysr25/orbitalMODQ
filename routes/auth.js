exports.loggedInOnly = (req, res, next) => {
  if (res.locals.isLoggedIn) return next()

  const error = new Error('You need to be logged in to do this.')
  error.status = 403
  next(error)
}

exports.loggedOutOnly = (req, res, next) => {
  if (!res.locals.isLoggedIn) return next()

  const error = new Error('You need to be logged out to do this.')
  error.status = 403
  next(error)
}
