import { lodash, deepmerge } from '@zmi/utils'

export function getUserConfigWithKey({
  key,
  userConfig
}: {
  key: string
  userConfig: Record<string, unknown>
}): any {
  return lodash.get(userConfig, key)
}

export function mergeDefault({ defaultConfig, config }: Record<string, any>) {
  if (lodash.isPlainObject(defaultConfig) && lodash.isPlainObject(config)) {
    return deepmerge(defaultConfig, config)
  }
  return typeof config !== 'undefined' ? config : defaultConfig
}
