import * as utils from '@zmi-cli/utils'

import {
  ICommand,
  IHook,
  IPluginConfig,
  EnumEnableBy,
  ServiceStage,
  IPlugin
} from './types'
import { pathToRegister } from './pluginUtils'
import Service from './Service'
import Html from './Html'

export interface IPluginAPIOptions {
  id: string
  key: string
  service: Service
}

interface IDescribe {
  id?: string
  key?: string
  config?: IPluginConfig
  enableBy?: EnumEnableBy | (() => boolean)
}

interface IRegisterMethod {
  name: string
  fn?: (...args: any[]) => void
  exitsError?: boolean
}

export default class PluginAPI {
  /**
   * @desc Service class this
   */
  service: Service

  /**
   * @desc plugin di
   */
  id: string

  /**
   * @desc plugin key
   */
  key: string

  /**
   * @desc utils
   */
  utils: typeof utils

  /**
   * @desc Html generated
   */
  Html: typeof Html

  constructor(options: IPluginAPIOptions) {
    this.service = options.service
    this.id = options.id
    this.key = options.key
    this.utils = utils
    this.Html = Html
  }

  describe({ id, key, config, enableBy }: IDescribe = {}) {
    const { plugins } = this.service
    // this.id and this.key is generated automatically
    // so we need to diff first
    if (id && this.id !== id) {
      if (plugins[id]) {
        throw new Error(
          `api.describe() failed, plugin ${id} is already registered by ${plugins[id].path}.`
        )
      }

      // overwrite the old describe
      plugins[id] = plugins[this.id]
      plugins[id].id = id
      delete plugins[this.id]
      this.id = id
    }
    if (key && this.key !== key) {
      this.key = key
      plugins[this.id].key = key
    }

    if (config) {
      plugins[this.id].config = config
    }

    plugins[this.id].enableBy = enableBy ?? EnumEnableBy.register
  }

  registerCommand(command: ICommand) {
    const { name, alias } = command
    utils.assert(
      `api.registerCommand() failed, the command ${name} is exists.`,
      !this.service.commands[name]
    )
    this.service.commands[name] = command
    if (alias) {
      this.service.commands[alias] = name
    }
  }

  registerMethod(options: IRegisterMethod) {
    const { fn: func, name, exitsError = true } = options
    const { pluginMethods } = this.service

    if (!pluginMethods[name]) {
      pluginMethods[name] =
        func ??
        function (this: PluginAPI, fn: { fn: () => void } | (() => void)) {
          this.register({
            key: name,
            ...(utils.lodash.isPlainObject(fn) ? fn : { fn })
          } as IHook)
        }
      return
    }

    if (exitsError) {
      throw new Error(`api.registerMethod() failed, method ${name} is already exist.`)
    }
  }

  registerPlugins(plugins: (IPlugin | string)[]) {
    utils.assert(
      `api.registerPlugins() failed, it should only be used in registering stage.`,
      this.service.stage === ServiceStage.initPlugins
    )
    utils.assert(
      `api.registerPlugins() failed, plugins must be Array.`,
      Array.isArray(plugins)
    )
    const extraPlugins = plugins.map((plugin) =>
      typeof plugin === 'string'
        ? pathToRegister({
            path: plugin,
            cwd: this.service.cwd
          })
        : plugin
    )

    this.service.extraPlugins.splice(0, 0, ...extraPlugins)
  }

  register(hook: IHook) {
    utils.assert(
      `api.register() failed, hook.key must supplied and should be string, but got ${hook.key}.`,
      hook.key && typeof hook.key === 'string'
    )
    utils.assert(
      `api.register() failed, hook.fn must supplied and should be function, but got ${hook.fn}.`,
      typeof hook.fn === 'function'
    )

    const { hooksByPluginId } = this.service
    hooksByPluginId[this.id] = (hooksByPluginId[this.id] ?? []).concat(hook)
  }

  skipPlugins(pluginIds: string[]) {
    pluginIds.forEach((pluginId) => {
      this.service.skipPluginIds.add(pluginId)
    })
  }
}
