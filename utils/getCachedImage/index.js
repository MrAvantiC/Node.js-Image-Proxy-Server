const fs = require('fs')
// const { getCacheDirPath } = require('..') // <- Why is this not working?
const getCacheDirPath = require('../getCacheDirPath')

module.exports = function getCachedImage({ filename, height, width, quality }) {
  const directoryPath = getCacheDirPath({ height, width, quality })
  const directoryPathWithFilename = `${directoryPath}/${filename}`

  if (!fs.existsSync(directoryPathWithFilename)) {
    return false
  }

  return fs.readFileSync(directoryPathWithFilename)
}
