module.exports = function getCacheDirPath({ height, width, quality }) {
  const cacheDir = process.env.CACHE_DIR
  let path = `${cacheDir}/quality=${quality}`

  if (width) {
    path += `/width=${width}`
  }

  if (height) {
    path += `/height=${height}`
  }

  return path
}
