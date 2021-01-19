type env = 'development' | 'production'

export function getBabelOpts({
  config,
  presetOpts,
  hot
}: {
  config: any
  presetOpts: Record<string, unknown>
  hot: boolean
}) {
  const { type } = presetOpts
  return {
    presets: [
      [require.resolve('@zmi/babel-preset/app'), presetOpts],
      config.extraBabelPresets
    ].filter(Boolean),
    plugins: [
      config.extraBabelPlugins,
      type === 'react' && hot && 'react-refresh/babel'
    ].filter(Boolean),
    sourceType: 'unambiguous',
    babelrc: false
  }
}

export function getBabelDepsOpts({ env, config }: { env: env; config: any }) {
  return {
    presets: [
      [
        require.resolve('@zmi/babel-preset/dependency'),
        {
          nodeEnv: env,
          dynamicImportNode: !config.dynamicImport
        }
      ]
    ],
    sourceType: 'unambiguous',
    babelrc: false
  }
}
