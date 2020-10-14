import { EventEmitter } from 'events'
import { resolvePlugins, resolvePresets } from './pluginUtils'

export default class Service extends EventEmitter {
  cwd: string
  pkg: any
  env: any

  extraPlugins = []

  initialPresets: any
  initialPlugins: any

  constructor(opts: any) {
    super()

    this.cwd = opts.cwd || process.cwd()
    this.pkg = opts.pkg
    this.env = opts.env
  }

  init() {}

  initPresetsAndPlugins() {
    this.extraPlugins = []
    
  }

  run() {}

  runCommand() {}
}
