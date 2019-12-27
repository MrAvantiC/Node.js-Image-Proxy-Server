const fs = require('fs')
const { getCacheDirPath } = require('../../utils')

module.exports = function getCachedImage(req, res, next) {
  const { filename, parameters } = res.locals
  const directoryPath = getCacheDirPath(parameters)
  const directoryPathWithFilename = `${directoryPath}/${filename}`

  if (!fs.existsSync(directoryPathWithFilename)) {
    return next()
  }

  const image = fs.readFileSync(directoryPathWithFilename)

  res.contentType('image/jpeg')
  res.send(image)
}
