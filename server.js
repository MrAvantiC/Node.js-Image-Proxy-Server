require('dotenv').config()

const express = require('express')

const {
  cacheImage,
  getCachedImage,
  fetchOriginalImage,
  modifyImage,
  getFilenameFromUrl,
  getParametersFromUrl,
} = require('./utils')

const app = express()
const port = 3000

app.get('*', async (req, res) => {
  const { height, width, quality = 100 } = getParametersFromUrl({
    path: req.url,
  })
  const filename = getFilenameFromUrl({ path: req.url })

  try {
    const cachedImage = getCachedImage({
      filename,
      height,
      width,
      quality,
    })

    if (cachedImage) {
      res.contentType('image/jpeg')
      res.send(cachedImage)
    } else {
      const originalImage = await fetchOriginalImage({ filename })

      const modifiedImage = await modifyImage({
        originalImage,
        height,
        width,
        quality,
      })

      await cacheImage({
        filename,
        image: modifiedImage.clone(), // clone here since we want to use the same Sharp-Instance for multiple operations (like toFile() and toBuffer())
        height,
        width,
        quality,
      })

      const response = await modifiedImage.toBuffer()

      res.contentType('image/jpeg')
      res.send(response)
    }
  } catch (err) {
    console.error(err)

    res.status(404)
    res.send(err.message)
  }
})

app.listen(port, () => console.log(`Server listening on port ${port}!`))
