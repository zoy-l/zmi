import { TransformOptions } from '@babel/core'
import { IPrivate } from '.'

export default function getBabelOpts({
  config,
  presetOpts,
  hot
}: {
  config: IPrivate
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
      type === 'react' &&
        isDev &&
        hot && [
          require.resolve('react-refresh/babel'),
          { skipEnvCheck: process.env.ZMI_TEST === 'true' }
        ],
      ...config.extraBabelPlugins
    ].filter(Boolean),
    sourceType: sourceMap ? 'unambiguous' : false,
    babelrc: false,
    configFile: false
  } as TransformOptions
}
