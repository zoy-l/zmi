module.exports = function (opts) {
  console.log([
    require('./lib').default,
    require('@zmi/utils').deepmerge(
      {
        typescript: true,
        env: {
          targets: {
            node: 'current'
          },
          modules: 'commonjs'
        }
      },
      opts
    )
  ])
  return {
    presets: [
      [
        require('./lib').default,
        require('@zmi/utils').deepmerge(
          {
            typescript: true,
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
