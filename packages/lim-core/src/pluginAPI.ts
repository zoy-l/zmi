import { assert, yargs } from '@lim/utils'
import { ICommand } from './types'
import Service from './Service'

export interface IPluginAPIOptions {
  id: string
  key: string
  service: Service
}

export default class PluginAPI {
  /**
   * @desc Service class this
   */
  service: Service

  /**
   * @desc hook di
   */
  id: string

  constructor(opts: IPluginAPIOptions) {
    this.service = opts.service
    this.id = opts.id
  }

  registerCommand(command: ICommand) {
    const { name, alias } = command
    assert(
      `api.registerCommand() failed, the command ${name} is exists.`,
      !this.service.commands[name]
    )
    this.service.commands[name] = command
    if (alias) {
      this.service.commands[alias] = name
    }
  }

  registerMethod(opts: {
    name: string
    fn?: (args: yargs.Arguments) => void
    exitsError?: boolean
  }) {
    const { fn, name, exitsError } = opts
    const { pluginMethods } = this.service

    if (!pluginMethods[name]) {
      pluginMethods[name] =
        fn ??
        function (this: PluginAPI, Fn: typeof Function) {
          const hook = {
            key: name,
            Fn
          }

          this.register(hook)
        }
      return
    }

    if (exitsError) {
      assert(`api.registerMethod() failed, method ${name} is already exist.`)
    }
  }

  register(hook: any) {
    const { hooksByPluginId } = this.service
    hooksByPluginId[this.id] = (hooksByPluginId[this.id] ?? []).concat(hook)
  }

  skipPlugins(pluginIds: string[]) {
    pluginIds.forEach((pluginId) => {
      this.service.skipPluginIds.add(pluginId)
    })
  }
}
