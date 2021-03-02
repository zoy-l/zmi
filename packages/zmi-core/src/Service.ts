import { BabelRegister, lodash, NodeEnv, yargsParser } from '@zmi-cli/utils'
import { AsyncSeriesWaterfallHook } from 'tapable'
import { IConfig } from '@zmi-cli/webpack'
import { EventEmitter } from 'events'
import assert from 'assert'
import path from 'path'

import { resolvePlugins, pathToRegister } from './pluginUtils'
import PluginAPI, { IPluginAPIOptions } from './PluginAPI'
import loadDotEnv from './withEnv'
import Config from './Config'
import paths from './paths'
import {
  ConfigChangeType,
  EnumApplyPlugins,
  IServicePaths,
  EnumEnableBy,
  ServiceStage,
  IPackage,
  ICommand,
  IPlugin,
  IHook
} from './types'

interface IRun {
  args?: Partial<yargsParser.Arguments>
  command: string
}

interface IApplyPlugins {
  type: EnumApplyPlugins
  initialValue?: any
  key: string
  args?: any
}

export interface IServiceOptions {
  plugins?: string[]
  pkg?: IPackage
  env?: NodeEnv
  cwd?: string
}

const Cycle = [
  'onPluginReady',
  'modifyPaths',
  'onStart',
  'modifyDefaultConfig',
  'modifyConfig'
]

const ServiceAttribute = [
  'ApplyPluginsType',
  'babelRegister',
  'applyPlugins',
  'ServiceStage',
  'initConifg',
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

function uniqCommand({ command, args }: IRun) {
  if (args && args._?.[0] === command) args._.shift()
}

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
   * @desc Config Instance
   */
  configInstance: Config

  /**
   * @desc initial user config
   */
  initConifg: IConfig

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
  pluginMethods: Record<string, (...args: any[]) => void> = {}

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

  /**
   * @desc lifecycle stage
   */
  stage: ServiceStage = ServiceStage.uninitialized

  /**
   * @desc enum lifecycle
   */
  ServiceStage = ServiceStage

  /**
   * @desc App path
   */
  paths: IServicePaths

  /**
   * @desc finally config
   */
  config!: IConfig

  /**
   * @desc extra command
   */
  args: any

  /**
   * @desc dev onChange type
   */
  ConfigChangeType = ConfigChangeType

  constructor(opts: IServiceOptions) {
    super()

    this.cwd = opts.cwd ?? process.cwd()
    this.pkg = opts.pkg ?? this.resolvePackage()
    this.env = opts.env ?? process.env.NODE_ENV

    this.babelRegister = new BabelRegister()

    // Load environment variables from .env file into process.env
    this.loadEnv()

    this.configInstance = new Config({
      cwd: this.cwd,
      service: this
    })

    this.initConifg = this.configInstance.getUserConfig()

    // Get the path of the app and expose it to the outside
    this.paths = paths({
      config: this.initConifg,
      cwd: this.cwd,
      env: this.env
    })

    this.initialPlugins = resolvePlugins({
      cwd: this.cwd,
      pkg: this.pkg,
      plugins: opts.plugins ?? [],
      userConfigPlugins: this.initConifg.plugins!
    })

    this.babelRegister.setOnlyMap({
      key: 'initialPlugins',
      value: lodash.uniq(this.initialPlugins.map(({ path }) => path))
    })
  }

  setStage(stage: ServiceStage) {
    this.stage = stage
  }

  async init() {
    this.setStage(ServiceStage.init)
    this.extraPlugins = lodash.cloneDeep(this.initialPlugins)

    this.setStage(ServiceStage.initPlugins)

    while (this.extraPlugins.length) {
      // An error will be reported here because `ESlint` prohibits all circular use of `await`
      // It is safe to use `await` in a loop without callback
      // eslint-disable-next-line no-await-in-loop
      await this.initPlugins(this.extraPlugins.shift()!)
    }

    this.setStage(ServiceStage.initHooks)
    Object.keys(this.hooksByPluginId).forEach((id) => {
      const hooks = this.hooksByPluginId[id]
      hooks.forEach((hook) => {
        const { key } = hook
        hook.pluginId = id
        this.hooks[key] = (this.hooks[key] ?? []).concat(hook)
      })
    })

    this.setStage(ServiceStage.pluginReady)
    await this.applyPlugins({
      key: 'onPluginReady',
      type: this.ApplyPluginsType.event
    })

    // get config, including:
    // 1. merge default config
    // 2. validate
    this.setStage(ServiceStage.getConfig)
    const defaultConfig = await this.applyPlugins({
      key: 'modifyDefaultConfig',
      type: this.ApplyPluginsType.modify,
      initialValue: this.configInstance.getDefaultConfig()
    })

    this.config = await this.applyPlugins({
      key: 'modifyConfig',
      type: this.ApplyPluginsType.modify,
      initialValue: this.configInstance.getConfig(defaultConfig)
    })

    this.setStage(ServiceStage.getPaths)

    // config.outputPath may be modified by plugins
    if (this.config?.outputPath) {
      this.paths.appOutputPath = path.join(this.cwd, this.config.outputPath)
    }
    const paths = await this.applyPlugins({
      key: 'modifyPaths',
      type: this.ApplyPluginsType.modify,
      initialValue: this.paths
    })

    Object.keys(paths).forEach((key) => {
      this.paths[key] = paths[key]
    })
  }

  async initPlugins(plugin: IPlugin) {
    const { id, key, apply = () => {} } = plugin

    const api = this.getPluginAPI({ id, key, service: this })

    // Plugin is cached here for checking
    this.plugins[plugin.id] = plugin

    // Plugin or Plugins
    // Execute plugin method and pass in api.any
    // There are two situations here
    // 1. Import the plug-in collection, then return a string[]
    // 2. Execute plug-in method and pass in api
    // there is an extra, no `require` is used, but `import` is used
    // and ʻimport` is a Promise, so `await` is needed here
    const { plugins } = ((await apply()(api)) as { plugins: string[] }) ?? {}

    // If it is an Array
    // It represents a collection of plugins added to the top of extraPlugins
    // Path verification pathToRegister has been done
    // `Reverse` to ensure the order of plugins

    if (Array.isArray(plugins) && plugins.length) {
      plugins.reverse().forEach((path) => {
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
    Cycle.forEach((name) => {
      pluginAPI.registerMethod({ name, exitsError: false })
    })

    return new Proxy(pluginAPI, {
      get: (target, prop: string) =>
        // The plugin Method has the highest weight, followed by Service, and finally plugin API
        // Because pluginMethods needs to be available in the register phase
        // The latest update must be dynamically obtained through proxy to achieve the effect of registering and using
        this.pluginMethods[prop] ??
        (ServiceAttribute.includes(prop)
          ? typeof this[prop] === 'function'
            ? this[prop].bind(this)
            : this[prop]
          : target[prop])
    })
  }

  async applyPlugins(pluginOptions: IApplyPlugins) {
    const { add, modify, event } = this.ApplyPluginsType
    const { key, type, args, initialValue } = pluginOptions

    const hookArgs = {
      [add]: initialValue ?? [],
      [modify]: initialValue,
      [event]: null
    }
    const typeIndex = Object.keys(hookArgs).indexOf(type)
    const hooks = this.hooks[key] ?? []

    // tapable: https://github.com/webpack/tapable
    const TypeSeriesWater = new AsyncSeriesWaterfallHook([typeIndex !== 2 ? 'memo' : '_'])

    // Add hook method into the actuator
    // Prepare for later
    // prettier-ignore
    const TypeSeriesWaterApply = (
      func: (hook: IHook) => (...Args: any[]) => Promise<any>
    ) => {
      hooks.forEach((hook) => {
        if (this.isPluginEnable(hook.pluginId!)) {
          TypeSeriesWater.tapPromise({
            name: hook.pluginId ?? `$${hook.key}`,
            stage: hook.stage ?? 0,
            before: hook.before
          }, func(hook))
        }
      })
    }

    // `add` requires return values, these return values will eventually be combined into an array
    // `modify`, need to modify the first parameter and return
    // `event`, no return value
    switch (type) {
      case add:
        if (initialValue !== undefined) {
          assert(
            Array.isArray(initialValue),
            `applyPlugins failed, opts.initialValue must be Array if opts.type is add.`
          )
        }
        TypeSeriesWaterApply((hook) => async (memo) => {
          const items = await hook.fn(args)
          return memo.concat(items)
        })
        break
      case modify:
        TypeSeriesWaterApply((hook) => async (memo) => hook.fn(memo, args))
        break
      case event:
        TypeSeriesWaterApply((hook) => async () => {
          await hook.fn(args)
        })
        break
      default:
        throw new Error(
          `applyPlugin failed, type is not defined or is not matched, got ${type}.`
        )
    }

    return TypeSeriesWater.promise(hookArgs[type]) as Promise<any>
  }

  isPluginEnable(pluginId: string) {
    const { key, enableBy } = this.plugins[pluginId]

    const skipStep = [
      this.skipPluginIds.has(pluginId),
      this.initConifg[key] === false,
      this.EnableBy.config === enableBy && !(key in this.initConifg)
    ]

    // judgment in order
    // the array order is fixed, the priority is the same as the array order
    while (skipStep.length) {
      if (skipStep.shift()) return false
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
    // exposed to the outside for inspection
    return pluginIds.every(
      (pluginId) => this.plugins[pluginId] && this.isPluginEnable(pluginId)
    )
  }

  resolvePackage() {
    try {
      return require(path.join(this.cwd, 'package.json'))
    } catch {
      return {}
    }
  }

  async run({ args, command }: IRun) {
    uniqCommand({ command, args })
    this.args = args
    await this.init()

    this.setStage(ServiceStage.run)
    await this.applyPlugins({
      key: 'onStart',
      type: this.ApplyPluginsType.event,
      args: { args }
    })

    return this.runCommand({ command, args })
  }

  async runCommand({ command, args }: IRun) {
    uniqCommand({ command, args })
    // If type alias is set
    // Need to find the actual command
    const event =
      typeof this.commands[command] === 'string'
        ? this.commands[this.commands[command] as string]
        : this.commands[command]

    assert(event, `run command failed, command "${command}" does not exists.`)
    const { fn } = event as ICommand

    return fn({ args })
  }
}
