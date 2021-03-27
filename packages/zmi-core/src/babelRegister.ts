import { slash } from '@zmi-cli/utils'

export default function babelRegister(path: string | string[]) {
  const only = Array.isArray(path) ? path : [path]

  require('@babel/register')({
    presets: [require.resolve('@zmi-cli/babel-factory/node')],
    ignore: [/node_modules/],
    only: only.map(slash),
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
    babelrc: false,
    cache: false
  })
}
