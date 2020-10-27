import Service from '.'

export default class PluginAPI {
  service: Service
  id: string

  constructor(opts: any) {
    this.service = opts.service
    this.id = opts.id
  }

  registerCommand(command: any) {
    const { name } = command
    this.service.commands[name] = command
  }

  registerMethod(opts: any) {
    const { fn, name, exitsError } = opts
    const { pluginMethods } = this.service

    if (!pluginMethods[name]) {
      pluginMethods[name] =
        fn ??
        function (this: PluginAPI, Fn: Function) {
          const hook = {
            key: name,
            Fn
          }

          this.register(hook)
        }
      return
    }

    if (exitsError) {
      throw new Error(
        `api.registerMethod() failed, method ${name} is already exist.`
      )
    }
  }

  register(hook: any) {
    const { hooksByPluginId } = this.service
    hooksByPluginId[this.id] = (hooksByPluginId[this.id] ?? []).concat(hook)
  }
}
