import { IConfig as nerdConfig } from 'zmi-nerd'

type IConfig = Pick<
  nerdConfig,
  | 'entry'
  | 'afterHook'
  | 'beforeReadWriteStream'
  | 'esBuild'
  | 'disableTypes'
  | 'lessOptions'
  | 'output'
  | 'paths'
  | 'extraBabelPlugins'
  | 'extraBabelPresets'
>

export default IConfig
