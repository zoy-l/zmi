const babelJest = require('babel-jest')

module.exports = babelJest.createTransformer({
  presets: [require.resolve('@zmi/babel-preset/node')],
  babelrc: false,
  configFile: false
})
