import { lodash, deepmerge } from '@zmi/utils'

export function mergeDefault({ defaultConfig, config }: Record<string, any>) {
  if (lodash.isPlainObject(defaultConfig) && lodash.isPlainObject(config)) {
    return deepmerge(defaultConfig, config)
  }
  return typeof config !== 'undefined' ? config : defaultConfig
}

export function getPlugin(name: string) {
  const hasScope = name.charAt(0) === '@'
  const re = /^(@zmi\/|zmi-)plugin-/
  return hasScope ? re.test(name.split('/')[1]) : re.test(name)
}
