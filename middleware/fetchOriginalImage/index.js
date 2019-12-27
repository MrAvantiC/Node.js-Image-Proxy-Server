const fetch = require('isomorphic-unfetch')

module.exports = async function fetchOriginalImage(req, res, next) {
  const { filename } = res.locals
  const serverUrl = process.env.MASTER_SERVER_URL

  const response = await fetch(serverUrl + '/' + filename)

  if (response.status !== 200) {
    let err = new Error('Requested image not found')
    err.statusCode = 404

    return next(err)
  }

  const image = await response.arrayBuffer()
  res.locals.image = Buffer.from(image)

  next()
}
