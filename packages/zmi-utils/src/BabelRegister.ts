import lodash from 'lodash'
import winPath from './winPath'

export default class BabelRegister {
  only: Record<string, string[]> = {}

  setOnlyMap({ key, value }: { key: string; value: string[] }) {
    this.only[key] = value
    this.register()
  }

  register() {
    const only = lodash.uniq(
      Object.keys(this.only)
        .reduce<string[]>((memo, key) => {
          return memo.concat(this.only[key])
        }, [])
        .map(winPath)
    )
    require('@babel/register')({
      presets: [require.resolve('@zmi/babel-preset/node')],
      ignore: [/node_modules/],
      only,
      extensions: ['.jsx', '.js', '.ts', '.tsx'],
      babelrc: false,
      cache: false
    })
  }
}
