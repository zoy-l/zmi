import * as utils from '@zmi/utils'

import { ICommand, IHook, IPluginConfig, EnumEnableBy } from './types'
import Service from './Service'

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
  fn?: (args: utils.yargs.Arguments) => void
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

  constructor(options: IPluginAPIOptions) {
    this.service = options.service
    this.id = options.id
    this.key = options.key
    this.utils = utils
  }

  describe({ id, key, config, enableBy }: IDescribe = {}) {
    const { plugins } = this.service
    // this.id and this.key is generated automatically
    // so we need to diff first
    if (id && this.id !== id) {
      plugins[id] &&
        utils.assert(
          `api.describe() failed, plugin ${id} is already registered by ${plugins[id].path}.`
        )

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
    const { fn, name, exitsError } = options
    const { pluginMethods } = this.service

    if (!pluginMethods[name]) {
      pluginMethods[name] =
        fn ??
        function (this: PluginAPI, Fn: () => void) {
          const hook = {
            key: name,
            fn: Fn
          }
          this.register(hook)
        }
      return
    }

    if (exitsError) {
      utils.assert(
        `api.registerMethod() failed, method ${name} is already exist.`
      )
    }
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
