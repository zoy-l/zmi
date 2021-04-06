module.exports = (api) => {
  api.describe({
    key: 'hoo',
    enableBy() {
      return api.initConfig.appType === 'console'
    }
  })

  api.register({
    key: 'count',
    fn() {
      return 'hoo'
    }
  })
}
