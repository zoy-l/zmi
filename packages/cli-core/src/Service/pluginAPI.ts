import Service from '.'

export default class PluginAPI {
  service: Service
  constructor(opts: any) {
    this.service = opts.service
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

    pluginMethods[name] = fn
  }
}
