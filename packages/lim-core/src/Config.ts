import {
  compatibleWithESModule,
  parseRequireDeps,
  clearModule,
  deepmerge,
  winPath,
  getFile,
  assert
} from '@lim/utils'

import { Service } from '.'
import path from 'path'
import fs from 'fs'

const possibleConfigPaths = [
  process.env.LIM_SERVICE_CONFIG_PATH,
  '.limrc.ts',
  '.limrc.js'
].filter(Boolean) as string[]

export default class Config {
  /**
   * @desc Directory path
   */
  cwd: string

  /**
   * @desc file name
   */
  configFile?: string

  /**
   * @desc Service instance
   */
  service: Service

  constructor(options: { cwd: string; service: Service }) {
    this.cwd = options.cwd ?? process.cwd()
    this.service = options.service
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

        !envConfigFile &&
          assert(
            [
              `get user config failed, ${envConfigFile} does not exist, `,
              `but process.env.UMI_ENV is set to ${process.env.LIM_ENV}.`
            ].join('')
          )
      }

      const files = [configFile, envConfigFile].filter((file) => {
        return file && fs.existsSync(path.join(this.cwd, file))
      }) as string[]

      const requireDeps = files.reduce((memo: string[], file) => {
        memo = memo.concat(parseRequireDeps(file))
        return memo
      }, [])

      requireDeps.forEach(clearModule)
      this.service.babelRegister.setOnlyMap({
        key: 'config',
        value: requireDeps
      })

      return this.mergeConfig(...this.requireConfigs(files))
    }

    return {}
  }

  addAffix(file: string, affix: string) {
    const ext = path.extname(file)
    return file.replace(new RegExp(`${ext}$`), `.${affix}${ext}`)
  }

  requireConfigs(configFiles: string[]) {
    return (
      configFiles &&
      configFiles.map((file) => compatibleWithESModule(require(file)))
    )
  }

  mergeConfig(...configs: Record<string, unknown>[]) {
    let ret = {}

    // TODO: Refined processing, such as processing dotted config key
    configs.forEach((config) => {
      ret = deepmerge(ret, config)
    })

    return ret
  }
}
