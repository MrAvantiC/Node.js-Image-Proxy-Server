const sharp = require('sharp')

module.exports = async function modifyImage(req, res, next) {
  const {
    image,
    parameters: { height, width, quality },
  } = res.locals

  res.locals.image = sharp(image)
    .resize({ height, width })
    .jpeg({ quality, progressive: true })

  next()
}
