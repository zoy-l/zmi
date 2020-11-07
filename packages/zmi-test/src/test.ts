import path from 'path'
import fs from 'fs'
import { assert } from '@zmi/utils'

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

  
}
