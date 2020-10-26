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

    if (pluginMethods[name]) {
      //
    }

    pluginMethods[name] =
      fn ??
      function (this: PluginAPI, Fn: Function) {
        const hook = {
          key: name,
          Fn
        }

        this.register(hook)
      }
  }

  register(hook: any) {
    this.service.hooksByPluginId[this.id] = (
      this.service.hooksByPluginId[this.id] ?? []
    ).concat(hook)
  }
}
