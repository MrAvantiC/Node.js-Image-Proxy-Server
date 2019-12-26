module.exports = function getFileameFromUrl({ path }) {
  const filenameRegex = new RegExp(/[^/]+$/g)
  const matches = path.match(filenameRegex)

  // only one match is expected here
  return matches[0]
}
