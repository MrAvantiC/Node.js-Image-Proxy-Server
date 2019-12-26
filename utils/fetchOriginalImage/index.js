const fetch = require('isomorphic-unfetch')

module.exports = async function fetchOriginalImage({ filename }) {
  const serverUrl = process.env.MASTER_SERVER_URL

  const response = await fetch(serverUrl + '/' + filename)

  if (response.status !== 200) throw new Error('Requested image not found')

  const image = await response.arrayBuffer()
  return Buffer.from(image)
}
