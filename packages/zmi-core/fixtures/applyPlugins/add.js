const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = function (api) {
  api.register({
    key: 'test',
    fn: () => 'a'
  })
  api.register({
    key: 'test',
    fn: async () => {
      await delay(100)
      return 'b'
    }
  })
  api.register({
    key: 'test',
    fn: () => ['c', 'd']
  })
}
