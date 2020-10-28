import { EnableBy } from './enums'

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
