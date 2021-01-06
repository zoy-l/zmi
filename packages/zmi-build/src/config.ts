import fs from 'fs'
import path from 'path'

import schema from './schema'
import { conversion } from './utils'
import getBabelConfig from './getBabelConifg'

export const CONFIG_FILES = ['.zmirc.ts', '.zmirc.js']

function isDefault(obj: any) {
  return obj.default ?? obj
}

function registerBabel({ cwd, only }: { cwd: string; only: string }) {
  const bebelConifg = getBabelConfig({ target: 'node' })
  bebelConifg.presets.unshift('@babel/preset-typescript')

  require('@babel/register')({
    ...bebelConifg,
    extensions: ['.js', '.ts'],
    only: [conversion(path.join(cwd, only))],
    babelrc: false,
    cache: false
  })
}

export default function (cwd: string) {
  const configFile = CONFIG_FILES.find((file) =>
    fs.existsSync(path.join(cwd, file))
  )

  if (configFile) {
    registerBabel({ cwd, only: configFile })
    const userConfig = isDefault(require(path.join(cwd, configFile)))
    const { error } = schema.validate(userConfig)

    if (error) {
      throw new Error(`Invalid options in ${error.message}`)
    }
    return userConfig
  }
  return {}
}
