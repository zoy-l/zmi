import {
  compatibleWithESModule,
  parseRequireDeps,
  clearModule,
  deepmerge,
  winPath,
  getFile,
  assert
} from '@zmi/utils'

import { Service } from '.'
import path from 'path'
import fs from 'fs'

const possibleConfigPaths = [
  process.env.LIM_CONFIG_PATH,
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

    let envConfigFile
    if (process.env.LIM_ENV) {
      // environment variable config file `.env.LIM_ENV` and remove ext
      // Because it is synthesized according to the base file
      // local may be `(j|t)s` file
      // If there is no configFile, the default is `.limrc`
      // Set here to `.ts` it has no practical effect, just a placeholder
      const envConfigFileName = this.addAffix(
        configFile ?? '.limrc.ts',
        process.env.LIM_ENV,
        false
      )

      // 👆 follow the above, or the real local environment config file
      envConfigFile = getFile({
        fileNameWithoutExt: envConfigFileName,
        type: 'javascript',
        base: this.cwd
      })?.filename

      !envConfigFile &&
        assert(
          [
            `get user config failed, ${envConfigFile} does not exist, `,
            `but process.env.LIM_ENV is set to ${process.env.LIM_ENV}.`
          ].join('')
        )
    }

    // check the authenticity of documents
    const files = [configFile, envConfigFile].filter((file) => {
      if (file) {
        const real = path.join(this.cwd, file)
        return fs.existsSync(real) && real
      }
      return false
    }) as string[]

    if (files.length) {
      // handling circular references
      // clear require cache
      const requireDeps = files.reduce((memo: string[], file) => {
        return memo.concat(parseRequireDeps(file))
      }, [])
      requireDeps.forEach(clearModule)

      // Just-in-time compilation at runtime
      this.service.babelRegister.setOnlyMap({
        key: 'config',
        value: requireDeps
      })

      return this.mergeConfig([...files])
    }

    return {}
  }

  addAffix(file: string, affix: string, isExt = true) {
    const ext = path.extname(file)
    return file.replace(new RegExp(`${ext}$`), `.${affix}${isExt ? ext : ''}`)
  }

  requireConfigs(configFiles: string[]) {
    return (
      configFiles &&
      configFiles.map((file) => compatibleWithESModule(require(file)))
    )
  }

  mergeConfig(configs: string[]) {
    let newConfig = {}

    // TODO: Refined processing, such as processing dotted config key
    this.requireConfigs(configs).forEach((config) => {
      newConfig = deepmerge(newConfig, config)
    })

    return newConfig
  }
}
