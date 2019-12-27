module.exports = async function sendImage(req, res, next) {
  let { image } = res.locals

  image = await image.toBuffer()

  res.contentType('image/jpeg')
  res.send(image)
}
