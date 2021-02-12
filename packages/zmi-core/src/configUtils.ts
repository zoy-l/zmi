import { lodash, deepmerge } from '@zmi-cli/utils'

export function mergeDefault({ defaultConfig, config }: Record<string, any>) {
  if (lodash.isPlainObject(defaultConfig) && lodash.isPlainObject(config)) {
    return deepmerge(defaultConfig, config)
  }
  return typeof config !== 'undefined' ? config : defaultConfig
}

export function getPlugin(name: string) {
  const hasScope = name.charAt(0) === '@'
  const re = /^(@zmi-cli\/|zmi-)plugin-/
  return hasScope ? re.test(name.split('/')[1]) : re.test(name)
}

function funcToStr(obj: typeof Function | Record<string, any>) {
  if (typeof obj === 'function') return obj.toString()
  if (lodash.isPlainObject(obj)) {
    return Object.keys(obj).reduce((memo, key) => {
      memo[key] = funcToStr(obj[key])
      return memo
    }, {})
  }
  return obj
}

export function isEqual(a: any, b: any) {
  return lodash.isEqual(funcToStr(a), funcToStr(b))
}
