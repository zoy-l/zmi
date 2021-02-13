import { IPrivate } from '@zmi-cli/types'

export default function (config: IPrivate) {
  // filter false and 0 targets
  const targets = Object.keys(config.targets)
    .filter((key) => {
      if (config.targets[key] === false) return false
      return key !== 'node'
    })
    .reduce((memo, key) => {
      memo[key] = config.targets[key]
      return memo
    }, {})

  const browserslist =
    config.targets.browsers ??
    Object.keys(targets).map(
      (key) => `${key} >= ${targets[key] === true ? '0' : targets[key]}`
    )

  return {
    targets,
    browserslist
  }
}
