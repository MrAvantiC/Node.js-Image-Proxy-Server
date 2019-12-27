module.exports = function getParametersFromUrl(req, res, next) {
  const path = req.url

  const parameterRegex = /width=(\d+)|(height=\d+)|(quality=\d+)/g
  const parameterArray = path.match(parameterRegex)

  let parameters = {}

  if (!Array.isArray(parameterArray)) {
    parameters = { quality: 100 }
  } else {
    parameters = parameterArray.reduce((acc, parameter) => {
      const [name, value] = parameter.split('=')

      return { ...acc, [name]: Number(value) }
    }, {})
  }

  res.locals.parameters = parameters

  next()
}
