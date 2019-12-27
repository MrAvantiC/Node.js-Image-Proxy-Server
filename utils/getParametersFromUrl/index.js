module.exports = function getParametersFromUrl({ path }) {
  const parameterRegex = /width=(\d+)|(height=\d+)|(quality=\d+)/g
  const parameters = path.match(parameterRegex)

  if (!Array.isArray(parameters)) return {}

  return parameters.reduce((acc, parameter) => {
    const [name, value] = parameter.split('=')

    return { ...acc, [name]: Number(value) }
  }, {})
}
