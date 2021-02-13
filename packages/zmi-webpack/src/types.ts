import type { IPrivate } from '@zmi-cli/types'
import WebpackChain from 'webpack-chain'
import webpack from 'webpack'

export interface IConfigOpts {
  chainWebpack?: (webpackConfig: WebpackChain, args: Record<string, any>) => Promise<any>
  modifyBabelPresetOpts?: <T>(opts: T) => Promise<T> | T
  modifyBabelOpts?: <T>(opts: T) => Promise<T> | T
  bundleImplementor?: typeof webpack
  env: 'development' | 'production'
  entry: Record<string, any>
  pkg: Record<string, any>
  htmlContent: string
  config: IPrivate
  hot: boolean
  port?: number
  cwd: string
}
