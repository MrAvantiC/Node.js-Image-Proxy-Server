module.exports = function getFilenameFromUrl(req, res, next) {
  const path = req.url

  const filenameRegex = new RegExp(/[^/]+$/g)
  const matches = path.match(filenameRegex)

  // only one match is expected here
  res.locals.filename = matches[0]

  next()
}
