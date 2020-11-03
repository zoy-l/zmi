import { assert, BabelRegister, lodash, NodeEnv, yargs } from '@lim/utils'
import { AsyncSeriesWaterfallHook } from 'tapable'
import { EventEmitter } from 'events'
import path from 'path'

import { resolvePlugins, pathToRegister, isPromise } from './pluginUtils'
import { IPlugin, IHook, ICommand, IPackage } from './types'
import PluginAPI, { IPluginAPIOptions } from './pluginAPI'
import { ApplyPluginsType } from './enums'

interface IRun {
  args: yargs.Arguments
  command: string
}

interface IApplyPlugins {
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
  /**
   * @desc Directory path
   */
  cwd: string

  /**
   * @desc Directory package.json
   */
  pkg: IPackage

  /**
   * @desc Environment variable
   */
  env: string | undefined

  /**
   * @desc Plug-in to be registered
   */
  extraPlugins: IPlugin[] = []

  /**
   * @desc user config
   */
  userConfig: any = {}

  /**
   * @desc runtime babel
   */
  babelRegister: BabelRegister

  /**
   * @desc initial Plugins
   */
  initialPlugins: IPlugin[] = []

  /**
   * @desc registered commands
   */
  commands: Record<string, ICommand | string> = {}

  /**
   * @desc plugin Methods
   */
  pluginMethods: Record<
    string,
    ((args: yargs.Arguments) => void) | ((fn: typeof Function) => void)
  > = {}

  /**
   * @desc plugin set
   */
  plugins: Record<string, IPlugin> = {}

  /**
   * @desc hooks
   */
  hooks: Record<string, IHook[]> = {}

  /**
   * @desc { Record<string, IHook[]> }
   */
  hooksByPluginId: Record<string, IHook[]> = {}

  /**
   * @desc The id of the plugin that does not need to be loaded
   */
  skipPluginIds: Set<string> = new Set<string>()

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

  async init() {
    this.extraPlugins = lodash.cloneDeep(this.initialPlugins)

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

    await this.applyPlugins({
      key: 'onPluginReady',
      type: ApplyPluginsType.event
    })
  }

  initPlugins(plugin: IPlugin) {
    const { id, key, apply } = plugin

    const api = this.getPluginAPI({ id, key, service: this })

    this.registerPlugin(plugin)

    // Plugin or Plugins
    // Execute plugin method and pass in api.any
    const plugins = this.applyAPI({
      api,
      apply
    }) as string[] | undefined

    // If it is an Array
    // It represents a collection of plugins added to the top of extraPlugins
    // Path verification pathToRegister has been done
    if (Array.isArray(plugins)) {
      plugins.forEach((path) => {
        this.extraPlugins.unshift(pathToRegister({ path, cwd: this.cwd }))
      })

      // The collection may contain the same plugin
      // So here is a de-duplication process
      this.extraPlugins = lodash.uniq(this.extraPlugins)
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

  applyAPI(options: {
    apply: () => (api: PluginAPI) => string[] | undefined
    api: PluginAPI
  }) {
    const ret = options.apply()(options.api)

    if (isPromise(ret)) {
      assert('Only allowed "require", "improt" still an experimental feature')
    }
    return ret
  }

  async applyPlugins(pluginOptions: IApplyPlugins) {
    const { add, modify, event } = ApplyPluginsType
    const { key, type, args } = pluginOptions

    const isMemo = [add, modify].includes(type)
    const hooks = this.hooks[key] ?? []

    // tapable: https://github.com/webpack/tapable
    const TypeSeriesWater = new AsyncSeriesWaterfallHook([
      isMemo ? 'memo' : '_'
    ])
    const TypeSeriesWaterApply = (
      func: (hook: IHook) => (...args: any[]) => Promise<any>
    ) => {
      hooks.forEach((hook) => {
        // prettier-ignore
        TypeSeriesWater.tapPromise({
          name: hook.pluginId ?? `$${hook.key}`,
          stage: hook.stage ?? 0,
          before: hook.before
        }, func(hook))
      })
    }

    switch (type) {
      case add:
        TypeSeriesWaterApply((hook) => async (memo) => {
          const items = await hook.fn(pluginOptions.args)
          return memo.concat(items)
        })
        return TypeSeriesWater.promise(pluginOptions.initialValue ?? [])
      case modify:
        TypeSeriesWaterApply((hook) => async (memo) => {
          return hook.fn(memo, pluginOptions.args)
        })
        return TypeSeriesWater.promise(pluginOptions.initialValue)
      case event:
        TypeSeriesWaterApply((hook) => async () => {
          await hook.fn(args)
        })
        return TypeSeriesWater.promise(null)
      default:
        assert(
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
    await this.init()

    await this.applyPlugins({
      key: 'onStart',
      type: ApplyPluginsType.event,
      args: { args }
    })

    this.runCommand({ command, args })
  }

  runCommand({ command, args }: IRun) {
    const event = this.commands[command]

    assert(`run command failed, command "${command}" does not exists.`, event)
    const { fn } = event as ICommand

    fn({ args })
  }
}
