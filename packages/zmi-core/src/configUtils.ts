import { lodash } from '@zmi/utils'

export function getUserConfigWithKey({
  key,
  userConfig
}: {
  key: string
  userConfig: Record<string, unknown>
}): any {
  return lodash.get(userConfig, key)
}
