import type { IPrivate } from '@zmi-cli/types'
import WebpackChain from 'webpack-chain'

export interface IConfigOpts {
  chainWebpack?: (webpackConfig: WebpackChain, args: Record<string, any>) => Promise<any>
  modifyBabelPresetOpts?: <T>(opts: T) => Promise<T> | T
  modifyBabelOpts?: <T>(opts: T) => Promise<T> | T
  env: 'development' | 'production'
  entry: Record<string, any>
  pkg: Record<string, any>
  htmlContent: string
  config: IPrivate
  hot: boolean
  port?: number
  cwd: string
}

export interface IPenetrateOptions {
  targets: Record<string, any>
  webpackConfig: WebpackChain
  configOptions: IConfigOpts
  browserslist: any
  config: IPrivate
  isTypescript: boolean
  sourceMap: boolean
  isVue: boolean
  isProd: boolean
  isDev: boolean
  isReact: boolean
  useHash: string
}
