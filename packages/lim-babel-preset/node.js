module.exports = function (opts) {
  return {
    presets: [
      [
        require('./lib').default,
        require('@lim/utils').deepmerge(
          {
            typescript: true,
            react: true,
            env: {
              targets: {
                node: 'current'
              },
              modules: 'commonjs'
            }
          },
          opts
        )
      ]
    ]
  }
}
