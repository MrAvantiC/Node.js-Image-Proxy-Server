const sharp = require('sharp')

module.exports = async function modifyImage({
  originalImage,
  height,
  width,
  quality,
}) {
  return sharp(originalImage)
    .resize({ height, width })
    .jpeg({ quality, progressive: true })
}
