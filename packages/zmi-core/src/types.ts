import { yargs } from '@zmi/utils'

export enum ServiceStage {
  uninitialized,
  init,
  initPlugins,
  initHooks,
  pluginReady,
  getConfig,
  getPaths,
  run
}

export enum EnumApplyPlugins {
  add = 'add',
  modify = 'modify',
  event = 'event'
}

export enum EnumEnableBy {
  register = 'register',
  config = 'config'
}

export interface IDep {
  [name: string]: string
}

export interface IPackage {
  name?: string
  dependencies?: IDep
  devDependencies?: IDep
  [key: string]: any
}

export interface IPluginConfig {
  default?: any
  onChange?: string | typeof Function
}

export interface IPlugin {
  id: string
  key: string
  path: string
  apply: () => any
  config?: IPluginConfig
  isPreset?: boolean
  enableBy?: EnumEnableBy | (() => void)
}

export interface IHook {
  key: string
  fn: (args?: { args: yargs.Arguments }, option?: any) => Promise<any> | void
  pluginId?: string
  before?: string
  stage?: number
}

export interface ICommand {
  name: string
  alias?: string
  description?: string
  details?: string
  fn: {
    ({ args }: { args: yargs.Arguments }): void
  }
}

export type IServicePathKeys =
  | 'cwd'
  | 'appNodeModulesPath'
  | 'appOutputPath'
  | 'appSrcPath'
  | 'appPagesPath'

export type IServicePaths = {
  [key in IServicePathKeys]: string
}
