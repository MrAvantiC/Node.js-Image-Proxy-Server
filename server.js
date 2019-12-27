require('dotenv').config()

const express = require('express')

const {
  getParametersFromUrl,
  getFilenameFromUrl,
  getCachedImage,
  fetchOriginalImage,
  modifyImage,
  cacheImage,
  sendImage,
  handleError,
} = require('./middleware')

const app = express()
const port = 3000

app.get('*', [
  getParametersFromUrl,
  getFilenameFromUrl,
  getCachedImage,
  fetchOriginalImage,
  modifyImage,
  cacheImage,
  sendImage,
  handleError,
])

app.listen(port, () => console.log(`Server listening on port ${port}!`))
