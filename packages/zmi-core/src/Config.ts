import {
  compatibleWithESModule,
  parseRequireDeps,
  clearModule,
  deepmerge,
  winPath,
  getFile,
  assert
} from '@zmi/utils'
import Joi from 'joi'

import { mergeDefault } from './configUtils'
import { ServiceStage } from './types'
import { Service } from '.'
import path from 'path'
import fs from 'fs'

const possibleConfigPaths = [
  process.env.LIM_CONFIG_PATH,
  '.zmirc.ts',
  '.zmirc.js'
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

  getDefaultConfig() {
    const { plugins } = this.service
    const pluginIds = Object.keys(plugins)

    // collect default config
    return pluginIds.reduce((memo, pluginId) => {
      const { key, config = {} } = plugins[pluginId]
      if ('default' in config) memo[key] = config.default
      return memo
    }, {})
  }

  getConfig({ defaultConfig }: { defaultConfig: Record<string, unknown> }) {
    const { stage, plugins } = this.service
    assert(
      `Config.getConfig() failed, it should not be executed before plugin is ready.`,
      stage >= ServiceStage.pluginReady
    )

    const userConfig = this.getUserConfig()

    const userConfigKeys = Object.keys(userConfig).filter(
      (key) => userConfig[key] !== false
    )

    debugger
    // get config
    Object.keys(plugins).forEach((pluginId) => {
      const { key, config = {} } = plugins[pluginId]
      const value = userConfig[key]

      debugger

      // recognize as key if have `schema` config
      // disabled when `value` is false
      if (!config.schema || !value) return

      const schema = config.schema(Joi)
      assert(
        `schema return from plugin ${pluginId} is not valid schema.`,
        Joi.isSchema(schema)
      )
      const { error } = schema.validate(value)
      error && assert(`Validate config "${key}" failed, ${error.message}`)

      const index = userConfigKeys.indexOf(key.split('.')[0])
      if (index !== -1) {
        userConfigKeys.splice(index, 1)
      }

      // update userConfig with defaultConfig
      if (key in defaultConfig) {
        const newValue = mergeDefault({
          defaultConfig: defaultConfig[key],
          config: value
        })
        userConfig[key] = newValue
      }
    })

    if (userConfigKeys.length) {
      const keys = userConfigKeys.length > 1 ? 'keys' : 'key'
      assert(`Invalid config ${keys}: ${userConfigKeys.join(', ')}`)
    }

    return userConfig
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
    if (process.env.ZMI_ENV) {
      // environment variable config file `.env.ZMI_ENV` and remove ext
      // Because it is synthesized according to the base file
      // local may be `(j|t)s` file
      // If there is no configFile, the default is `.zmirc`
      // Set here to `.ts` it has no practical effect, just a placeholder
      const envConfigFileName = this.addAffix(
        configFile ?? '.zmirc.ts',
        process.env.ZMI_ENV,
        !!configFile
      )

      // 👆 follow the above, or the real local environment config file
      envConfigFile = getFile({
        fileNameWithoutExt: envConfigFileName,
        type: 'javascript',
        base: this.cwd
      })?.filename

      !envConfigFile &&
        assert([
          `get user config failed, ${envConfigFile} does not exist, `,
          `but process.env.ZMI_ENV is set to ${process.env.ZMI_ENV}.`
        ])
    }

    // check the authenticity of documents
    const files = [configFile, envConfigFile]
      .map((file) => {
        if (file) {
          const real = path.join(this.cwd, file)
          return fs.existsSync(real) && real
        }
        return false
      })
      .filter(Boolean) as string[]

    if (files.length) {
      // handling circular references
      // clear require cache
      const requireDeps = files.reduce(
        (memo: string[], file) => memo.concat(parseRequireDeps(file)),
        []
      )
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
