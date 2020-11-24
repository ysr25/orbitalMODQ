exports.sendResponse = (req, res) => {
  res.status(200).json({
    isLoggedIn: res.locals.isLoggedIn,
    isAuthor: res.locals.isAuthor,
    isUpvoted: res.locals.isUpvoted,
    isDownvoted: res.locals.isDownvoted,
    message: res.locals.msg === null ? '' : res.locals.msg,
    content: res.locals.content === null ? '' : res.locals.content
  })
}
