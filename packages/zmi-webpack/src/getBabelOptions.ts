export function getBabelOpts({
  config,
  presetOpts,
  hot
}: {
  config: any
  presetOpts: Record<string, unknown>
  hot: boolean
}) {
  const { type, isDev, sourceMap } = presetOpts
  return {
    presets: [
      [require.resolve('@zmi-cli/babel-factory/app'), presetOpts],
      ...config.extraBabelPresets
    ].filter(Boolean),
    plugins: [
      type === 'react' && isDev && hot && require.resolve('react-refresh/babel'),
      ...config.extraBabelPlugins
    ].filter(Boolean),
    sourceType: sourceMap ? 'unambiguous' : false,
    babelrc: false
  }
}
