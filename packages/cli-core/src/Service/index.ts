import { EventEmitter } from 'events'
import yargs from 'yargs'
import PluginAPI from './pluginAPI'
import { resolvePlugins, resolvePresets } from './pluginUtils'

export default class Service extends EventEmitter {
  cwd: string
  pkg: any
  env: any

  extraPlugins = []

  userConfig: any = {}

  initialPresets: any
  initialPlugins: any

  pluginMethods: {
    [name: string]: Function
  } = {}

  constructor(opts: any) {
    super()

    this.cwd = opts.cwd || process.cwd()
    this.pkg = opts.pkg
    this.env = opts.env

    this.initialPresets = resolvePresets({
      cwd: this.cwd,
      pkg: this.pkg,
      presets: opts.presets || [],
      userConfigPresets: this.userConfig.presets || []
    })
  }

  init() {
    this.initPresetsAndPlugins()
  }

  initPresetsAndPlugins() {
    this.extraPlugins = []

    while (this.initialPresets.length) {
      this.initPreset(this.initialPresets.shift())
    }
  }

  initPreset(preset: any) {
    const { id, key, apply } = preset

    preset.isPreset = true
  }

  getPluginAPI(opts: any) {
    const pluginAPI = new PluginAPI(opts)

    return new Proxy(pluginAPI, {
      get: (target, prop) => {
        //
        return target[prop]
      }
    })
  }

  applyAPI(opts: any) {
    let ret = opts.apply()(opts.api)
    // if (isPromise(ret)) {
    //   ret = await ret
    // }
    return ret || {}
  }

  run({ args, command }: { args: yargs.Arguments; command: string }) {
    debugger
    this.init()
  }

  runCommand() {}
}
