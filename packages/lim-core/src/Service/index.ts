import { assert, BabelRegister, lodash } from '@lim/utils'
import { AsyncSeriesWaterfallHook } from 'tapable'
import { EventEmitter } from 'events'
import yargs from 'yargs'

import { resolvePlugins, pathToRegister, isPromise } from './pluginUtils'
import { ApplyPluginsType } from './enums'
import PluginAPI from './pluginAPI'
import { IPlugin } from './types'

interface IRun {
  args: yargs.Arguments
  command: string
}

const cycle = [
  'onPluginReady',
  'modifyPaths',
  'onStart',
  'modifyDefaultConfig',
  'modifyConfig'
]

export default class Service extends EventEmitter {
  cwd: string

  pkg: any

  env: string | undefined

  extraPlugins: any[] = []

  userConfig: any = {}

  babelRegister: BabelRegister

  initialPresets: any

  initialPlugins: IPlugin[]

  commands: any = {}

  pluginMethods: {
    [name: string]: typeof Function
  } = {}

  plugins: Record<string, IPlugin> = {}

  hooks: any = {}

  hooksByPluginId: any

  constructor(opts: any) {
    super()

    this.cwd = opts.cwd ?? process.cwd()
    this.pkg = opts.pkg
    this.env = opts.env

    this.babelRegister = new BabelRegister()

    this.initialPlugins = resolvePlugins({
      cwd: this.cwd,
      pkg: this.pkg,
      plugins: opts.plugins ?? [],
      userConfigPlugins: this.userConfig.plugins ?? []
    })

    this.babelRegister.setOnlyMap({
      key: 'initialPlugins',
      value: lodash.uniq(this.initialPlugins.map(({ path }) => path))
    })
  }

  init() {
    this.initPresetsAndPlugins()
  }

  initPresetsAndPlugins() {
    this.extraPlugins = [this.initialPlugins.shift()]

    while (this.extraPlugins.length) {
      this.initPlugins(this.extraPlugins.shift())
    }
  }

  initPlugins(plugin: IPlugin) {
    const { id, key, apply } = plugin

    const api = this.getPluginAPI({ id, key, service: this })

    this.registerPlugin(plugin)

    const plugins = this.applyAPI({
      api,
      apply
    }) as string[] | Record<string, unknown>

    if (Array.isArray(plugins)) {
      plugins &&
        plugins.forEach((path) => {
          this.extraPlugins.unshift(pathToRegister({ path, cwd: this.cwd }))
        })

      this.extraPlugins = lodash.uniq([
        ...this.extraPlugins,
        ...this.initialPlugins
      ])
    }
  }

  getPluginAPI(opts: any) {
    const pluginAPI = new PluginAPI(opts)

    // life cycle
    cycle.forEach((name) => {
      pluginAPI.registerMethod({ name, exitsError: false })
    })

    return new Proxy(pluginAPI, {
      get: (target, prop: string) => {
        if (this.pluginMethods[prop]) {
          return this.pluginMethods[prop]
        }

        return target[prop]
      }
    })
  }

  registerPlugin(plugin: IPlugin) {
    this.plugins[plugin.id] = plugin
  }

  applyAPI(options: { apply: () => any; api: PluginAPI }) {
    const ret = options.apply()(options.api) ?? {}

    if (isPromise(ret)) {
      assert(
        false,
        'Only allowed "require", "improt" still an experimental feature'
      )
    }
    return ret
  }

  async applyPlugins(pluginOptions: any) {
    const { key, type, args } = pluginOptions

    const hooks = this.hooks[key] ?? []
    debugger
    switch (type) {
      case ApplyPluginsType.add:
        const typeAdd = new AsyncSeriesWaterfallHook(['memo'])
        hooks.forEach((hook: any) => {
          typeAdd.tapPromise(
            {
              name: hook.pluginId,
              stage: hook.stage ?? 0,
              before: hook.before
            },
            async (memo: any) => {
              const items = await hook.fn(pluginOptions.args)
              return memo.concat(items)
            }
          )
        })
        return typeAdd.promise(pluginOptions.initialValue ?? [])
      case ApplyPluginsType.modify:
        const typeModify = new AsyncSeriesWaterfallHook(['memo'])
        hooks.forEach((hook: any) => {
          typeModify.tapPromise(
            {
              name: hook.pluginId,
              stage: hook.stage ?? 0,
              before: hook.before
            },
            async (memo: any) => {
              return hook.fn(memo, pluginOptions.args)
            }
          )
        })
        return typeModify.promise(pluginOptions.initialValue)
      case ApplyPluginsType.event:
        const typeEvent = new AsyncSeriesWaterfallHook(['_'])
        hooks.forEach((hook: any) => {
          typeEvent.tapPromise(
            {
              name: hook.pluginId,
              stage: hook.stage ?? 0,
              before: hook.before
            },
            async () => {
              await hook.fn(args)
            }
          )
        })
        return typeEvent.promise(null)
      default:
        assert(
          false,
          `applyPlugin failed, type is not defined or is not matched, got "${type}".`
        )
    }
  }

  async run({ args, command }: IRun) {
    debugger
    this.init()

    await this.applyPlugins({
      key: 'onStart',
      type: ApplyPluginsType.event,
      args: { args }
    })

    this.runCommand({ command, args })
  }

  runCommand({ command, args }: IRun) {
    const event = this.commands[command]

    assert(event, `run command failed, command "${command}" does not exists.`)
    assert(
      event.fn,
      `run command failed, command "${command}",method is not defined`
    )

    event.fn({ args })
  }
}
