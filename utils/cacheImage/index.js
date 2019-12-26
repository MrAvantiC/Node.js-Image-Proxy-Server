const fs = require('fs')
// const { getCacheDirPath } = require('..') // <- Why is this not working?
const getCacheDirPath = require('../getCacheDirPath')

module.exports = async function cacheImage({
  filename,
  image,
  height,
  width,
  quality,
}) {
  const directoryPath = getCacheDirPath({ height, width, quality })
  const directoryPathWithFileame = `${directoryPath}/${filename}`

  if (fs.existsSync(directoryPathWithFileame)) {
    return
  }

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
  }

  await image.toFile(directoryPathWithFileame)
}
