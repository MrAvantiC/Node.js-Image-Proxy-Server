const fs = require('fs')
const { getCacheDirPath } = require('../../utils')

module.exports = async function cacheImage(req, res, next) {
  const {
    image,
    filename,
    parameters: { height, width, quality },
  } = res.locals

  const directoryPath = getCacheDirPath({ height, width, quality })
  const directoryPathWithFileame = `${directoryPath}/${filename}`

  if (fs.existsSync(directoryPathWithFileame)) {
    return next()
  }

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
  }

  // clone here since we want to use the same Sharp-Instance for multiple operations
  // like toFile() and toBuffer()
  await image.clone().toFile(directoryPathWithFileame)

  next()
}
