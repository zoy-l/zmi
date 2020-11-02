import { yargs } from '@lim/utils'
import { EnableBy } from './enums'

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
  enableBy?: EnableBy | typeof Function
}

export interface IHook {
  key: string
  fn: (value: any) => any | Promise<unknown>
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
