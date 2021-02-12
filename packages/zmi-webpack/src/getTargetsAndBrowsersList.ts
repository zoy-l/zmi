import { deepmerge } from '@zmi-cli/utils'

interface IOpts {
  config: any
}

export default function ({ config }: IOpts) {
  let targets: Record<string, any> = deepmerge(
    { chrome: 49, firefox: 64, safari: 10, edge: 13, ios: 10 },
    config.targets ?? {}
  )

  // filter false and 0 targets
  targets = Object.keys(targets)
    .filter((key) => {
      if (targets[key] === false) return false
      return key !== 'node'
    })
    .reduce((memo, key) => {
      memo[key] = targets[key]
      return memo
    }, {})

  const browserslist =
    targets.browsers ??
    Object.keys(targets).map(
      (key) => `${key} >= ${targets[key] === true ? '0' : targets[key]}`
    )

  return {
    targets,
    browserslist
  }
}
