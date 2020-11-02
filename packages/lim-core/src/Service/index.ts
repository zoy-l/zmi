import { assert, BabelRegister, lodash, NodeEnv } from '@lim/utils'
import { AsyncSeriesWaterfallHook } from 'tapable'
import { EventEmitter } from 'events'
import yargs from 'yargs'
import path from 'path'

import { resolvePlugins, pathToRegister, isPromise } from './pluginUtils'
import { IPlugin, IHook, ICommand, IPackage } from './types'
import PluginAPI, { IPluginAPIOptions } from './pluginAPI'
import { ApplyPluginsType } from './enums'

interface IRun {
  args: yargs.Arguments
  command: string
}

interface IApply {
  key: string
  type: ApplyPluginsType
  initialValue?: unknown
  args?: any
}

export interface IServiceOptions {
  cwd: string
  pkg?: IPackage
  plugins?: string[]
  env?: NodeEnv
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

  pkg: IPackage

  env: string | undefined

  extraPlugins: IPlugin[] = []

  userConfig: any = {}

  babelRegister: BabelRegister

  initialPlugins: IPlugin[] = []

  commands: Record<string, ICommand> = {}

  pluginMethods: Record<string, typeof Function> = {}

  plugins: Record<string, IPlugin> = {}

  hooks: Record<string, IHook[]> = {}

  hooksByPluginId: Record<string, IHook[]> = {}

  constructor(opts: IServiceOptions) {
    super()

    this.cwd = opts.cwd ?? process.cwd()
    this.pkg = opts.pkg ?? this.resolvePackage()
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
    this.extraPlugins = [this.initialPlugins[0]]

    while (this.extraPlugins.length) {
      this.initPlugins(this.extraPlugins.shift()!)
    }

    Object.keys(this.hooksByPluginId).forEach((id) => {
      const hooks = this.hooksByPluginId[id]
      hooks.forEach((hook) => {
        const { key } = hook
        hook.pluginId = id
        this.hooks[key] = (this.hooks[key] ?? []).concat(hook)
      })
    })

    this.applyPlugins({
      key: 'onPluginReady',
      type: ApplyPluginsType.event
    })
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
      plugins.forEach((path) => {
        this.extraPlugins.unshift(pathToRegister({ path, cwd: this.cwd }))
      })

      this.extraPlugins = lodash.uniq([
        ...this.extraPlugins,
        ...this.initialPlugins
      ])
    }
  }

  getPluginAPI(opts: IPluginAPIOptions) {
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

  async applyPlugins(pluginOptions: IApply) {
    const { key, type, args } = pluginOptions

    const hooks = this.hooks[key] ?? []
    debugger
    switch (type) {
      case ApplyPluginsType.add:
        const typeAdd = new AsyncSeriesWaterfallHook(['memo'])
        hooks.forEach((hook) => {
          typeAdd.tapPromise(
            {
              name: hook.pluginId ?? hook.key,
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
        hooks.forEach((hook) => {
          typeModify.tapPromise(
            {
              name: hook.pluginId ?? hook.key,
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
        hooks.forEach((hook) => {
          typeEvent.tapPromise(
            {
              name: hook.pluginId ?? hook.key,
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

  resolvePackage() {
    try {
      return require(path.join(this.cwd, 'package.json'))
    } catch (err) {
      return {}
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
