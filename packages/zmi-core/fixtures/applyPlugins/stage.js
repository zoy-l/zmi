module.exports = function (api) {
  api.register({
    key: 'test',
    fn: () => 'a'
  })
  api.register({
    key: 'test',
    fn: async () => 'b',
    stage: 1000
  })
  api.register({
    key: 'test',
    fn: () => 'c',
    stage: -1
  })
  api.register({
    key: 'test',
    fn: () => 'd'
  })
  api.register({
    key: 'test',
    fn: () => 'e'
  })
}
