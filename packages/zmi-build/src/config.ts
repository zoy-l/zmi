import fs from 'fs'
import path from 'path'

import schema from './schema'

export const CONFIG_FILES = ['.zmirc.ts', '.zmirc.js']

function isDefault(obj: any) {
  return obj.default ?? obj
}

export default function (cwd: string) {
  const configFile = CONFIG_FILES.find((file) =>
    fs.existsSync(path.join(cwd, file))
  )

  if (configFile) {
    const userConfig = isDefault(require(path.join(cwd, configFile)))
    const { error } = schema.validate(userConfig)

    if (error) {
      throw new Error(`Invalid options in ${error.message}`)
    }
    return userConfig
  }
  return {}
}
