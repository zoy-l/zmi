import { EventEmitter } from 'events'
import { resolvePlugins, resolvePresets } from './pluginUtils'

export default class Service extends EventEmitter {
  cwd: string
  pkg: any
  env: any

  extraPlugins = []

  userConfig: any = {}

  initialPresets: any
  initialPlugins: any

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

  init() {}

  initPreset(preset: any) {
    const { id, key, apply } = preset

    preset.isPreset = true
  }

  initPresetsAndPlugins() {
    this.extraPlugins = []

    while (this.initialPresets.length) {
      this.initPreset(this.initialPresets.shift())
    }
  }

  run(opts: any) {}

  runCommand() {}
}
