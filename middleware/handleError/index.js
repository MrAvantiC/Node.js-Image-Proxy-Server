module.exports = function handleError(err, req, res, next) {
  // set a generic server error status code if none is part of the err
  if (!err.statusCode) {
    err.statusCode = 500
  }

  res.status(err.statusCode).send(err.message)
}
