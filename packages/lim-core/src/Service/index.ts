import { assert, BabelRegister, lodash, NodeEnv, yargs } from '@lim/utils'
import { AsyncSeriesWaterfallHook } from 'tapable'
import { EventEmitter } from 'events'
import path from 'path'

import { resolvePlugins, pathToRegister, isPromise } from './pluginUtils'
import PluginAPI, { IPluginAPIOptions } from './pluginAPI'
import loadDotEnv from './withEnv'
import {
  IPlugin,
  IHook,
  ICommand,
  IPackage,
  EnumApplyPlugins,
  EnumEnableBy
} from './types'

interface IRun {
  command: string
  args: yargs.Arguments
}

interface IApplyPlugins {
  key: string
  type: EnumApplyPlugins
  initialValue?: any
  args?: { args: yargs.Arguments }
}

export interface IServiceOptions {
  cwd: string
  env?: NodeEnv
  pkg?: IPackage
  plugins?: string[]
}

const cycle = [
  'onPluginReady',
  'modifyPaths',
  'onStart',
  'modifyDefaultConfig',
  'modifyConfig'
]

const ServiceAttribute = [
  'ConfigChangeType',
  'ApplyPluginsType',
  'babelRegister',
  'applyPlugins',
  'ServiceStage',
  'userConfig',
  'hasPlugins',
  'EnableBy',
  'config',
  'paths',
  'stage',
  'args',
  'env',
  'cwd',
  'pkg'
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

  /**
   * @desc How to enable the plug-in, the default is to register and enable
   */
  EnableBy = EnumEnableBy

  /**
   * @desc Apply Plugin enumeration value, provide a plug-in use
   */
  ApplyPluginsType = EnumApplyPlugins

  constructor(opts: IServiceOptions) {
    super()

    this.cwd = opts.cwd ?? process.cwd()
    this.pkg = opts.pkg ?? this.resolvePackage()
    this.env = opts.env ?? process.env.NODE_ENV

    this.babelRegister = new BabelRegister()

    // Load environment variables from .env file into process.env
    this.loadEnv()

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
      type: EnumApplyPlugins.event
    })
  }

  initPlugins(plugin: IPlugin) {
    const { id, key, apply } = plugin

    const api = this.getPluginAPI({ id, key, service: this })

    // Plugin is cached here for checking
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
        // The plugin Method has the highest weight, followed by Service, and finally plugin API
        // Because pluginMethods needs to be available in the register phase
        // The latest update must be dynamically obtained through proxy to achieve the effect of registering and using
        return this.pluginMethods[prop] ?? ServiceAttribute.includes(prop)
          ? typeof this[prop] === 'function'
            ? this[prop].bind(this)
            : this[prop]
          : target[prop]
      }
    })
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
    const { add, modify, event } = EnumApplyPlugins
    const { key, type, args, initialValue } = pluginOptions

    const hookArgs = {
      [add]: initialValue ?? [],
      [modify]: initialValue,
      [event]: null
    }
    const typeIndex = Object.keys(hookArgs).indexOf(type)
    const hooks = this.hooks[key] ?? []

    // tapable: https://github.com/webpack/tapable
    const TypeSeriesWater = new AsyncSeriesWaterfallHook([
      typeIndex !== 2 ? 'memo' : '_'
    ])

    // Add hook method into the actuator
    // Prepare for later
    const TypeSeriesWaterApply = (
      func: (hook: IHook) => (...Args: any[]) => Promise<any>
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

    // `add` requires return values, these return values will eventually be combined into an array
    // `modify`, need to modify the first parameter and return
    // `event`, no return value
    switch (type) {
      case add:
        TypeSeriesWaterApply((hook) => async (memo) => {
          const items = await hook.fn(args)
          return memo.concat(items)
        })
        break
      case modify:
        TypeSeriesWaterApply((hook) => async (memo) => {
          return hook.fn(memo, args)
        })
        break
      case event:
        TypeSeriesWaterApply((hook) => async () => {
          await hook.fn(args)
        })
        break
      default:
        assert(
          `applyPlugin failed, type is not defined or is not matched, got "${type}".`
        )
    }
    return TypeSeriesWater.promise(hookArgs[EnumApplyPlugins[typeIndex]])
  }

  registerPlugin(plugin: IPlugin) {
    this.plugins[plugin.id] = plugin
  }

  isPluginEnable(pluginId: string) {
    const { key, enableBy } = this.plugins[pluginId]

    const skipStep = [
      this.skipPluginIds.has(pluginId),
      this.userConfig[key] === false,
      this.EnableBy.config === enableBy && !(key in this.userConfig)
    ]

    // judgment in order
    // the array order is fixed, the priority is the same as the array order
    for (let step = 0; step < skipStep.length; step++) {
      if (skipStep[step]) {
        return false
      }
    }

    return typeof enableBy !== 'function' || enableBy()
  }

  loadEnv() {
    const basePath = path.join(this.cwd, '.env')
    const localPath = `${basePath}.local`
    loadDotEnv(basePath)
    loadDotEnv(localPath)
  }

  hasPlugins(pluginIds: string[]) {
    return pluginIds.every((pluginId) => {
      const plugin = this.plugins[pluginId]
      return plugin && this.isPluginEnable(pluginId)
    })
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
      type: EnumApplyPlugins.event,
      args: { args }
    })

    this.runCommand({ command, args })
  }

  runCommand({ command, args }: IRun) {
    // If type alias is set
    // Need to find the actual command
    const event =
      typeof this.commands[command] === 'string'
        ? this.commands[this.commands[command] as string]
        : this.commands[command]

    assert(`run command failed, command "${command}" does not exists.`, event)
    const { fn } = event as ICommand

    fn({ args })
  }
}
