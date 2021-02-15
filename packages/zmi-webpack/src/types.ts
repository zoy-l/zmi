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
  port?: number
  cwd: string
}

export interface IPenetrateOptions extends IConfigOpts {
  targets: Record<string, any>
  webpackConfig: WebpackChain
  browserslist: any
  config: IPrivate
  isTypescript: boolean
  sourceMap: boolean
  isVue: boolean
  isProd: boolean
  isDev: boolean
  isReact: boolean
  useHash: string
  htmlContent: string
  hot: boolean
}
