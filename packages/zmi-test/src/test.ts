import { options as CliOptions } from 'jest-cli/build/cli/args'
import { assert, mergeConfig } from '@zmi/utils'
import { runCLI } from 'jest'
import path from 'path'
import fs from 'fs'

import { PickedJestCliOptions } from './types'
import defaultConfig from './defaultConfig'

export default async function (args: any) {
  process.env.NODE_ENV = 'test'

  const cwd = args.cwd ?? process.cwd()

  const userJestConfigFile = path.join(cwd, 'jest.config.js')
  const userJestConfig =
    fs.existsSync(userJestConfigFile) && require(userJestConfigFile)
  assert(`config from jest.config.js: ${JSON.stringify(userJestConfig)}`)

  const packageJSONPath = path.join(cwd, 'package.json')
  const packageJestConfig =
    fs.existsSync(packageJSONPath) && require(packageJSONPath).jest
  assert(`jest config from package.json: ${JSON.stringify(packageJestConfig)}`)

  const config = mergeConfig(
    defaultConfig(cwd, args),
    packageJestConfig,
    userJestConfig
  )

  const argsConfig = Object.keys(CliOptions).reduce((prev, name) => {
    if (args[name]) prev[name] = args[name]

    // Convert alias args into real one
    const { alias } = CliOptions[name]
    if (alias && args[alias]) prev[name] = args[alias]
    return prev
  }, {} as PickedJestCliOptions)

  // Must be a separate `config` configuration,
  // The value is `string`, otherwise it will not take effect
  // prettier-ignore
  // Run jest
  const result = await runCLI({
    config: JSON.stringify(config),
    _: args._ ?? [],
    $0: args.$0 ?? '',
    ...argsConfig
  },[cwd])

  assert(`Test with jest failed`, result.results.success)
}
