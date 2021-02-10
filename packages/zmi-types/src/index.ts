import webpackDevServer from 'webpack-dev-server'
import { IConfig as nerdConfig } from 'zmi-nerd'
import webpack, { Configuration } from 'webpack'
import { PluginAPI, Service } from '@zmi/core'
import WebpackChain from 'webpack-chain'

interface IManifest {
  fileName: string
  publicPath: string
  basePath: string
  writeToFileEmit: boolean
}

interface IGetter<T> {
  (): T
}

export interface IHTMLTag {
  [key: string]: string
}

export interface IScript extends Partial<HTMLScriptElement> {
  content?: string
}
export interface IStyle extends Partial<HTMLStyleElement> {
  content: string
}

export type IScriptConfig = Array<IScript | string>
export type IStyleConfig = Array<IStyle | string>

interface IEvent<T> {
  (fn: { (args: T): void }): void
  (args: { fn: { (args: T): void }; before?: string; stage?: number }): void
}

interface IModify<T, U> {
  (fn: { (initialValue: T, args: U): T }): void
  (fn: { (initialValue: T, args: U): Promise<T> }): void
  (args: { fn: { (initialValue: T, args: U): T }; before?: string; stage?: number }): void
  (args: {
    fn: { (initialValue: T, args: U): Promise<T> }
    before?: string
    stage?: number
  }): void
}

interface IAdd<T> {
  (fn: () => T[]): void
}

type ServicePluginApi = Pick<
  Service,
  | 'ConfigChangeType'
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
  }>

  addHTMLHeadScripts: IAdd<IScriptConfig>
  addHTMLScripts: IAdd<IScriptConfig>
  addHTMLMetas: IAdd<IHTMLTag>
  addHTMLLinks: IAdd<IHTMLTag>
  addHTMLStyles: IAdd<IHTMLTag>

  chainWebpack: IModify<
    WebpackChain,
    {
      webpack: typeof webpack
      createCSSRule: (
        rule: WebpackChain.Rule<WebpackChain.Rule>,
        isCSSModules: boolean
      ) => void
    }
  >
  modifyPaths: IModify<ServicePluginApi['paths'], null>
}

export interface IConfig {
  devServer?: webpackDevServer.Configuration
  frameType?: 'react' | 'vue' | 'miniApp'
  loaderOptions?: {
    lessLoader?: Record<string, any>
    scssLoader?: Record<string, any>
    postcssLoader?: Record<string, any>
    stylusLoader?: Record<string, any>
    styleLoader?: Record<string, any>
  }
  autoprefixer?: Record<string, any>
  links?: Partial<HTMLLinkElement>[]
  metas?: Partial<HTMLMetaElement>[]
  manifest?: Partial<IManifest>
  terserOptions?: Record<string, any>
  cssModulesTypescript?: boolean
  ignoreMomentLocale?: boolean
  publicPath?: string
  outputPath?: string
  alias?: Record<string, any>
  favicon?: string
  hash?: boolean
  define?: Record<string, any>
  devtool?: Pick<Configuration, 'devtool'>
  externals?: Pick<Configuration, 'externals'>
  dynamicImport?: boolean
  autoCSSModules?: boolean
  miniAppConfig?: Omit<
    nerdConfig,
    | 'pkgs'
    | 'nodeVersion'
    | 'nodeFiles'
    | 'browserFiles'
    | 'react'
    | 'target'
    | 'moduleType'
  >
  chainWebpack?: (
    meme: WebpackChain,
    options: {
      webpack: typeof webpack
      createCSSRule: (options: {
        lang: string
        test: RegExp
        loader?: string
        options?: Record<string, any>
      }) => void
      env: 'development' | 'production'
    }
  ) => void | Promise<void>
}

type INonEmpty<T extends Record<string, any>, U extends keyof T> = Pick<T, U> &
  Omit<{ [key in keyof T]-?: T[key] }, U>

export type IPrivate = INonEmpty<IConfig, 'externals' | 'alias'>
