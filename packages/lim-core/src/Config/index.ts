import { winPath, getFile, assert } from '@lim/utils'

import fs from 'fs'
import path from 'path'

const possibleConfigPaths = [
  process.env.LIM_SERVICE_CONFIG_PATH,
  '.limrc.ts',
  '.limrc.js'
].filter(Boolean) as string[]

export default class Config {
  cwd: any

  configFile?: string

  constructor(options: any) {
    this.cwd = options.cwd
  }

  getConfigFile() {
    const configFile = possibleConfigPaths.find((file) =>
      fs.existsSync(path.join(this.cwd, file))
    )
    return configFile ? winPath(configFile) : undefined
  }

  getUserConfig() {
    const configFile = this.getConfigFile()
    this.configFile = configFile

    if (configFile) {
      let envConfigFile
      if (process.env.LIM_ENV) {
        const envConfigFileName = this.addAffix(configFile, process.env.LIM_ENV)
        const fileNameWithoutExt = envConfigFileName.replace(
          path.extname(envConfigFileName),
          ''
        )
        envConfigFile = getFile({
          base: this.cwd,
          fileNameWithoutExt,
          type: 'javascript'
        })?.filename

        if (!envConfigFile) {
          assert(
            `get user config failed, ${envConfigFile} does not exist, but process.env.UMI_ENV is set to ${process.env.LIM_ENV}.`
          )
        }
      }
    }
  }

  addAffix(file: string, affix: string) {
    const ext = path.extname(file)
    return file.replace(new RegExp(`${ext}$`), `.${affix}${ext}`)
  }
}
