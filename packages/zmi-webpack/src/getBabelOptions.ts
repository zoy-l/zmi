export function getBabelOpts({
  config,
  presetOpts,
  hot
}: {
  config: any
  presetOpts: Record<string, unknown>
  hot: boolean
}) {
  const { type, isDev } = presetOpts
  return {
    presets: [
      [require.resolve('@zmi/babel-preset/app'), presetOpts],
      ...config.extraBabelPresets
    ].filter(Boolean),
    plugins: [
      type === 'react' && isDev && hot && 'react-refresh/babel',
      ...config.extraBabelPlugins
    ].filter(Boolean),
    sourceType: 'unambiguous',
    babelrc: false
  }
}
