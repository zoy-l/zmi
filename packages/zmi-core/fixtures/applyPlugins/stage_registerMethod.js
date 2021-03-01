module.exports = function (api) {
  api.registerMethod({
    name: 'foo'
  })

  api.foo(() => 'a')
  api.foo({
    fn: async () => 'b',
    stage: 1000
  })
  api.foo({
    fn: () => 'c',
    stage: -1
  })
  api.foo({
    fn: () => 'd'
  })
  api.foo({
    fn: () => 'e'
  })
}
