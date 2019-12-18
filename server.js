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

function getFileNameFromUrl({ path }) {
  const fileNameRegex = new RegExp(/[^/]+$/g)
  const matches = path.match(fileNameRegex)

  // only one match is expected here
  return matches[0]
}

async function getOriginalImage({ fileName }) {
  const serverUrl = process.env.MASTER_SERVER_URL

  const response = await fetch(serverUrl + '/' + fileName)

  if (response.status !== 200) throw new Error('Requested image not found')

  const image = await response.arrayBuffer()
  return Buffer.from(image)
}

app.get('*', async (req, res) => {
  const { height, width, quality = 100 } = getParametersFromUrl({
    path: req.url,
  })
  const fileName = getFileNameFromUrl({ path: req.url })

  try {
    const originalImage = await getOriginalImage({ fileName })

    const modifiedImage = await sharp(originalImage)
      .resize({ height, width })
      .jpeg({ quality, progressive: true })
      .toBuffer()

    res.contentType('image/jpeg')
    res.send(modifiedImage)
  } catch (err) {
    res.status(404)
    res.send(err.message)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
