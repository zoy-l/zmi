import { winPath, clearModule } from '@lim/utils'
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
      //
    }
  }
}
