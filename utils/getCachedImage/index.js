const fs = require('fs')
// const { getCacheDirPath } = require('..') // <- Why is this not working?
const getCacheDirPath = require('../getCacheDirPath')

module.exports = function getCachedImage({
  filename,
  image,
  height,
  width,
  quality,
}) {
  const directoryPath = getCacheDirPath({ height, width, quality })
  const directoryPathWithFileame = `${directoryPath}/${filename}`

  if (!fs.existsSync(directoryPathWithFileame)) {
    return false
  }

  return fs.readFileSync(directoryPathWithFileame)
}
