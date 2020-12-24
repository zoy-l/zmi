type env = 'development' | 'production'

interface IOpts {
  config: any
  env: 'development' | 'production'
  targets?: Record<string, unknown>
}

function getBasicBabelLoaderOpts() {
  return {
    // Tell babel to guess the type, instead assuming all files are modules
    // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
    sourceType: 'unambiguous',
    babelrc: false,
    // cacheDirectory: process.env.BABEL_CACHE !== 'none'
  }
}

export function getBabelPresetOpts(opts: IOpts) {
  return {
    nodeEnv: opts.env,
    dynamicImportNode: !opts.config.dynamicImport,
    autoCSSModules: true,
    svgr: true,
    env: {
      targets: opts.targets
    },
    import: []
  }
}

export function getBabelOpts({
  config,
  presetOpts,
  hot
}: {
  config: any
  presetOpts: Record<string, unknown>
  hot: boolean
}) {
  return {
    ...getBasicBabelLoaderOpts(),
    presets: [
      [require.resolve('@zmi/babel-preset/app'), presetOpts],
      ...(config.extraBabelPresets ?? [])
    ],
    plugins: [
      ...(config.extraBabelPlugins ?? []),
      hot && 'react-refresh/babel'
    ].filter(Boolean)
  }
}

export function getBabelDepsOpts({ env, config }: { env: env; config: any }) {
  return {
    ...getBasicBabelLoaderOpts(),
    presets: [
      [
        require.resolve('@zmi/babel-preset/dependency'),
        {
          nodeEnv: env,
          dynamicImportNode: !config.dynamicImport
        }
      ]
    ]
  }
}
