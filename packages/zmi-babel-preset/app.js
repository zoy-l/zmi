module.exports = function (_context, opts) {
  const { nodeEnv } = opts
  delete opts.nodeEnv

  return {
    presets: [
      [
        require('./lib').default,
        require('@zmi/utils').deepmerge(
          {
            typescript: true,
            env: {
              useBuiltIns: 'entry',
              corejs: 3,
              modules: false
            },
            react: {
              development: nodeEnv === 'development'
            },
            transformRuntime: {},
            reactRemovePropTypes: nodeEnv === 'production',
            reactRequire: true,
            lockCoreJS3: {}
          },
          opts
        )
      ]
    ]
  }
}
