require('dotenv').config()

const fetch = require('isomorphic-unfetch')
const express = require('express')
const sharp = require('sharp')
const fs = require('fs')

const app = express()
const port = 3000

function getParametersFromUrl({ path }) {
  const parameterRegex = new RegExp(/width=(\d+)|(height=\d+)|(quality=\d+)/g)
  const parameters = path.match(parameterRegex)

  if (!Array.isArray(parameters)) return {}

  return parameters.reduce((acc, parameter) => {
    const [name, value] = parameter.split('=')

    return { ...acc, [name]: Number(value) }
  }, {})
}

function getFileameFromUrl({ path }) {
  const filenameRegex = new RegExp(/[^/]+$/g)
  const matches = path.match(filenameRegex)

  // only one match is expected here
  return matches[0]
}

async function fetchOriginalImage({ filename }) {
  const serverUrl = process.env.MASTER_SERVER_URL

  const response = await fetch(serverUrl + '/' + filename)

  if (response.status !== 200) throw new Error('Requested image not found')

  const image = await response.arrayBuffer()
  return Buffer.from(image)
}

async function modifyImage({ originalImage, height, width, quality }) {
  return sharp(originalImage)
    .resize({ height, width })
    .jpeg({ quality, progressive: true })
}

function getDirectoryPath({ height, width, quality }) {
  const cacheDir = process.env.CACHE_DIR
  let directoryPath = `${cacheDir}/quality=${quality}`

  if (width) {
    directoryPath += `/width=${width}`
  }

  if (height) {
    directoryPath += `/height=${height}`
  }

  return directoryPath
}

async function cacheImage({ filename, image, height, width, quality }) {
  const directoryPath = getDirectoryPath({ height, width, quality })
  const directoryPathWithFileame = `${directoryPath}/${filename}`

  if (fs.existsSync(directoryPathWithFileame)) {
    return
  }

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
  }

  await image.toFile(directoryPathWithFileame)
}

function getCachedImage({ filename, image, height, width, quality }) {
  const directoryPath = getDirectoryPath({ height, width, quality })
  const directoryPathWithFileame = `${directoryPath}/${filename}`

  if (!fs.existsSync(directoryPathWithFileame)) {
    return false
  }

  return fs.readFileSync(directoryPathWithFileame)
}

app.get('*', async (req, res) => {
  const { height, width, quality = 100 } = getParametersFromUrl({
    path: req.url,
  })
  const filename = getFileameFromUrl({ path: req.url })

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
    res.status(404)
    res.send(err.message)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
