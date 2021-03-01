module.exports = function (api) {
  api.describe({
    id: 'plugin_1',
    key: 'plugin_1'
  })
  api.skipPlugins(['plugin_2'])

  api.register({
    key: 'foo',
    fn: () => {}
  })
}
