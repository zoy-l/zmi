module.exports = function () {
  return {
    plugins: ['./plugins_1', './plugins_2', './plugins/index'].map((plugin) =>
      require.resolve(plugin)
    )
  }
}
