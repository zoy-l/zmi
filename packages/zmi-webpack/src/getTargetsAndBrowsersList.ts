import { BundlerConfigType } from '@zmi/types'

interface IOpts {
  config: any
  type: any
}

export default function ({ config, type }: IOpts) {
  let targets: any = config.targets ?? {}

  targets = Object.keys(targets)
    .filter((key) => {
      // filter false and 0 targets
      if (targets[key] === false) return false
      if (type === BundlerConfigType.ssr) return key === 'node'
      return key !== 'node'
    })
    .reduce((memo, key) => {
      memo[key] = targets[key]
      return memo
    }, {} as Record<string, string | number | false>)

  const browserslist =
    targets.browsers ??
    Object.keys(targets).map((key) => {
      return `${key} >= ${targets[key] === true ? '0' : targets[key]}`
    })

  return {
    targets,
    browserslist
  }
}
