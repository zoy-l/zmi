import { createCSSRule, IStyle, WebpackChain, webpack } from '@zmi-cli/webpack'
import { PluginAPI, Service } from '@zmi-cli/core'
import { cheerio } from '@zmi-cli/utils'

export interface ITargets {
  browsers?: any
  [key: string]: number | boolean
}

interface IGetter<T> {
  (): T
}

interface IEvent<T> {
  (fn: { (args: T): void }): void
  (args: { fn: { (args: T): void }; before?: string; stage?: number }): void
}

interface IModify<T, U> {
  (fn: { (memo: T, args: U): Promise<T> | T | void }): void
  // (args: { fn: { (initialValue: T, args: U): T }; before?: string; stage?: number }): void
  // (args: { fn: { (initialValue: T, args: U): Promise<T> }; before?: string; stage?: number }): void
}

interface IAdd<T> {
  (fn: () => T[] | T): void
}

type ServicePluginApi = Pick<
  Service,
  | 'ConfigChangeType'
  | 'ApplyPluginsType'
  | 'applyPlugins'
  | 'ServiceStage'
  | 'hasPlugins'
  | 'initConifg'
  | 'EnableBy'
  | 'config'
  | 'stage'
  | 'paths'
  | 'args'
  | 'cwd'
  | 'pkg'
  | 'env'
> &
  PluginAPI

export type IApi = ServicePluginApi & {
  getPort: IGetter<number>
  getHostname: IGetter<string>
  restartServer: () => void

  onStart: IEvent<{ args: Record<string, any> }>
  onExit: IEvent<{ signal: 'SIGINT' | 'SIGQUIT' | 'SIGTERM' }>
  onBuildComplete: IEvent<{
    err?: Error
    stats?: { stats: webpack.Stats[]; hash: string }
  }>
  onDevCompileDone: IEvent<{
    isFirstCompile: boolean
    stats: webpack.Stats
  }>

  addHTMLHeadScripts: IAdd<any>
  addHTMLScripts: IAdd<any>
  addHTMLMetas: IAdd<Partial<HTMLMetaElement>>
  addHTMLLinks: IAdd<Partial<HTMLLinkElement>>
  addHTMLStyles: IAdd<Partial<IStyle>>

  chainWebpack: IModify<
    WebpackChain,
    {
      webpack: typeof webpack
      createCSSRule: createCSSRule
    }
  >
  modifyPaths: IModify<ServicePluginApi['paths'], null>
  modifyHTML: IModify<cheerio.Root, null>
}
