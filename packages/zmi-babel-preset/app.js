module.exports = function (_context, opts) {
  const { type } = opts

  return {
    presets: [[require(`./lib/${type}`).default, opts]]
  }
}
