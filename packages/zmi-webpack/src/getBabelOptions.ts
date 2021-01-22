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
