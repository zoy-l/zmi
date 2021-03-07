import webpackDevServer from 'webpack-dev-server'
import { IConfig as nerdConfig } from 'zmi-nerd'
import HtmlPlugin from 'html-webpack-plugin'
import WebpackChain from 'webpack-chain'
import { Configuration } from 'webpack'

import { ICreateCSSRuleOpts } from './applyCss'

export type createCSSRule = (createCSSRuleOptions: ICreateCSSRuleOpts) => void

export interface IConfigOpts {
  chainWebpack?: (webpackConfig: WebpackChain, args: Record<string, any>) => void | Promise<any>
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

export interface IScript extends Partial<HTMLScriptElement> {
  content?: string
}
export interface IStyle extends Partial<HTMLStyleElement> {
  content: string
}

export type IScriptConfig = Array<IScript | string>
export type IStyleConfig = Array<IStyle | string>

export interface ITargets {
  browsers?: any
  [key: string]: number | boolean
}

// prettier-ignore
type KnownKeys<T> = {
  [K in keyof T]: string extends K
  ? never
  : number extends K
  ? never
  : K
} extends { [_ in keyof T]: infer U }
  ? U
  : never

type RequireOnly<T extends Record<any, any>> = Pick<T, KnownKeys<T>>

export interface IConfig {
  title?: string
  devServer?: webpackDevServer.Configuration
  frameType?: 'react' | 'vue' | 'miniApp'
  loaderOptions?: {
    lessLoader?: Record<string, any>
    scssLoader?: Record<string, any>
    postcssLoader?: Record<string, any>
    stylusLoader?: Record<string, any>
    styleLoader?: Record<string, any>
    cssLoader?: Record<string, any>
  }
  htmlPlugin?: Omit<RequireOnly<HtmlPlugin.Options>, 'favicon' | 'template' | 'templateContent'>
  cache?: 'memory' | 'filesystem'
  extraPostCSSPlugins?: string[]
  extraBabelPresets?: string[]
  extraBabelPlugins?: string[]
  plugins?: string[]
  autoprefixer?: Record<string, any>
  links?: Partial<
    HTMLLinkElement & {
      [key: string]: string
    }
  >[]
  metas?: Partial<
    HTMLMetaElement & {
      [key: string]: string
    }
  >[]
  scripts?: IScriptConfig
  headScripts?: IScriptConfig
  styles?: IStyleConfig
  frameOptions?: Record<string, any>
  terserOptions?: Record<string, any>
  cssModulesTypescript?: 'emit' | 'verify'
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
  targets?: ITargets
  miniAppConfig?: Omit<
    nerdConfig,
    'pkgs' | 'nodeVersion' | 'nodeFiles' | 'browserFiles' | 'react' | 'target' | 'moduleType'
  >
  chainWebpack?: (
    meme: WebpackChain,
    options: {
      createCSSRule: createCSSRule
      env: 'development' | 'production'
    }
  ) => void | Promise<void>
  [key: string]: any
}

type INonEmpty<T extends Record<string, any>, U> = {
  [key in keyof T]-?: key extends U ? INonEmpty<T[key], key> : T[key]
}

export type IPrivate = INonEmpty<IConfig, 'loaderOptions'>

export interface IModifyHTML {
  (memo: cheerio.Root): void
}

export type IHtmlConfig = Pick<IPrivate, 'metas' | 'links' | 'headScripts' | 'scripts'>

export interface IGetContentArgs extends IHtmlConfig {
  styles: IStyle[]
  tplPath?: string
  modifyHTML?: IModifyHTML
}
