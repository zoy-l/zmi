import Service from '.'

export default class PluginAPI {
  service: Service
  constructor(opts: any) {
    this.service = opts.service
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
