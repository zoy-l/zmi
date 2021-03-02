import assert from 'assert'
import {
  compatibleWithESModule,
  parseRequireDeps,
  clearModule,
  deepmerge,
  winPath,
  getFile,
  chalk,
  chokidar,
  lodash
} from '@zmi-cli/utils'
import Joi from 'joi'

import { isEqual, mergeDefault } from './configUtils'
import { IChanged, ServiceStage } from './types'
import { Service } from '.'
import path from 'path'
import fs from 'fs'

const possibleConfigPaths = [
  process.env.LIM_CONFIG_PATH,
  '.zmirc.ts',
  '.zmirc.js'
].filter(Boolean) as string[]

export interface IWatchOptions {
  userConfig: Record<string, any>
  onChange: (args: {
    pluginChanged: IChanged[]
    valueChanged: IChanged[]
    __watcher: chokidar.FSWatcher
  }) => Promise<void>
}

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
    this.cwd = options.cwd
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

  getConfig(defaultConfig: { [key: string]: any }) {
    const { stage, plugins } = this.service
    const userConfig = this.getUserConfig()

    assert(
      stage >= ServiceStage.pluginReady,
      `Config.getConfig() failed, it should not be executed before plugin is ready.`
    )

    const userConfigKeys = Object.keys(userConfig).filter(
      (key) => userConfig[key] !== false
    )

    const keepKeys = {}
    // get config
    Object.keys(plugins).forEach((pluginId) => {
      const { key, config = {} } = plugins[pluginId]
      const value = userConfig[key]

      if (!keepKeys[key]) {
        keepKeys[key] = key
      } else {
        throw new Error(`have multiple same ${key}`)
      }

      // recognize as key if have `schema` config
      // disabled when `value` is false
      if (!config.schema || value === false) return

      const schema = config.schema(Joi)
      assert(
        Joi.isSchema(schema),
        `schema return from plugin ${pluginId} is not valid schema.`
      )
      const { error } = schema.validate(value)

      if (error) {
        throw new Error(error.message)
      }

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
      throw new Error(`Invalid config ${keys}: ${userConfigKeys.join(', ')}`)
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
      // !!configFile
      const envConfigFileName = this.addAffix(
        configFile ?? '.zmirc.ts',
        process.env.ZMI_ENV
      )

      // 👆 follow the above, or the real local environment config file
      envConfigFile = getFile({
        fileNameWithoutExt: envConfigFileName,
        type: 'javascript',
        base: this.cwd
      })?.filename

      if (!envConfigFile) {
        // prettier-ignore
        throw new Error([
          `get user config failed, ${envConfigFile} does not exist, `,
          `but process.env.ZMI_ENV is set to ${process.env.ZMI_ENV}.`
        ].join(''))
      }
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
      requireDeps.forEach((path) => {
        clearModule(path)
      })

      // Just-in-time compilation at runtime
      this.service.babelRegister.setOnlyMap({
        key: 'config',
        value: requireDeps
      })

      return this.mergeConfig([...files])
    }

    return {}
  }

  // , isExt = true ${isExt ? ext : ''}
  addAffix(file: string, affix: string) {
    const ext = path.extname(file)
    return file.replace(new RegExp(`${ext}$`), `.${affix}`)
  }

  requireConfigs(configFiles: string[]) {
    return configFiles && configFiles.map((file) => compatibleWithESModule(require(file)))
  }

  mergeConfig(configs: string[]) {
    let newConfig = {}

    // TODO: Refined processing, such as processing dotted config key
    this.requireConfigs(configs).forEach((config) => {
      newConfig = deepmerge(newConfig, config)
    })

    return newConfig
  }

  getWatchFilesAndDirectories() {
    const zmiEnv = process.env.ZMI_ENV
    const configFiles = lodash.clone(possibleConfigPaths)
    possibleConfigPaths.forEach((f) => {
      if (zmiEnv) configFiles.push(this.addAffix(f, zmiEnv))
    })

    const files = configFiles.reduce<string[]>((memo, f) => {
      const file = winPath(path.join(this.cwd, f))
      if (fs.existsSync(file)) {
        memo = memo.concat(parseRequireDeps(file))
      } else {
        memo.push(file)
      }
      return memo
    }, [])

    return files
  }

  watch(opts: IWatchOptions) {
    let paths = this.getWatchFilesAndDirectories()
    let { userConfig } = opts
    const watcher = chokidar.watch(paths, {
      ignoreInitial: true,
      cwd: this.cwd,
      awaitWriteFinish: {
        stabilityThreshold: 500
      }
    })
    watcher.on('all', (event, path) => {
      console.log(chalk.bgGray(` ${event} `), path)
      const newPaths = this.getWatchFilesAndDirectories()
      const diffs = lodash.difference(newPaths, paths)

      if (diffs.length) {
        watcher.add(diffs)
        paths = paths.concat(diffs)
      }

      const newUserConfig = this.getUserConfig()
      const pluginChanged: IChanged[] = []
      const valueChanged: IChanged[] = []

      Object.keys(this.service.plugins).forEach((pluginId) => {
        const { key, config = {} } = this.service.plugins[pluginId]
        // recognize as key if have schema config
        if (!isEqual(newUserConfig[key], userConfig[key]) && config.schema) {
          if (newUserConfig[key] === false || userConfig[key] === false) {
            pluginChanged.push({ key, pluginId })
          } else {
            valueChanged.push({ key, pluginId })
          }
        }
      })

      if (pluginChanged.length || valueChanged.length) {
        opts.onChange({
          pluginChanged,
          valueChanged,
          __watcher: watcher
        })
      }

      userConfig = newUserConfig
    })
  }
}
