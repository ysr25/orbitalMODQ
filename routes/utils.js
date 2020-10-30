exports.sendResponse = (req, res) => {
  res.status(200).json(res.locals)
}
