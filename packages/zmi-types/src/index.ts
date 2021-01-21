import { PluginAPI, Service } from '@zmi/core'
import WebpackChain from 'webpack-chain'
import webpack from 'webpack'

export enum BundlerConfigType {
  csr = 'csr',
  ssr = 'ssr'
}

export type IBundlerConfigType = keyof typeof BundlerConfigType

interface IGetter<T> {
  (): T
}

interface IEvent<T> {
  (fn: { (args: T): void }): void
  (args: { fn: { (args: T): void }; before?: string; stage?: number }): void
}

interface IModify<T, U> {
  (fn: { (initialValue: T, args: U): T }): void
  (fn: { (initialValue: T, args: U): Promise<T> }): void
  (args: {
    fn: { (initialValue: T, args: U): T }
    before?: string
    stage?: number
  }): void
  (args: {
    fn: { (initialValue: T, args: U): Promise<T> }
    before?: string
    stage?: number
  }): void
}

type ServicePluginApi = Pick<
  Service,
  | 'ApplyPluginsType'
  | 'applyPlugins'
  | 'ServiceStage'
  | 'hasPlugins'
  | 'userConfig'
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
    type: IBundlerConfigType
  }>

  chainWebpack: IModify<
    WebpackChain,
    {
      webpack: typeof webpack
      // createCSSRule: ICreateCSSRule
      type: IBundlerConfigType
    }
  >
  modifyPaths: IModify<ServicePluginApi['paths'], null>
}
