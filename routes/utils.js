exports.sendResponse = (req, res) => {
  res.status(200).json({
    isLoggedIn: res.locals.isLoggedIn,
    msg: res.locals.msg === null ? '' : res.locals.msg,
    content: res.locals.content === null ? '' : res.locals.content
  })
}
