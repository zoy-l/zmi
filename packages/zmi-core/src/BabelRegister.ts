import { lodash, slash } from '@zmi-cli/utils'

export default class BabelRegister {
  only: Record<string, string[]> = {}

  setOnlyMap({ key, value }: { key: string; value: string[] }) {
    this.only[key] = value
    this.register()
  }

  register() {
    const only = lodash.uniq(
      Object.keys(this.only)
        .reduce<string[]>((memo, key) => memo.concat(this.only[key]), [])
        .map(slash)
    )

    require('@babel/register')({
      presets: [require.resolve('@zmi-cli/babel-factory/node')],
      ignore: [/node_modules/],
      only,
      extensions: ['.jsx', '.js', '.ts', '.tsx'],
      babelrc: false,
      cache: false
    })
  }
}