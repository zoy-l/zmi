import { yargs } from '@zmi/utils'
import Joi from 'joi'
import { IConfig } from './Service'

export enum ServiceStage {
  uninitialized,
  init,
  initPlugins,
  initHooks,
  pluginReady,
  getConfig,
  getPaths,
  run
}

export enum EnumApplyPlugins {
  add = 'add',
  modify = 'modify',
  event = 'event'
}

export enum EnumEnableBy {
  register = 'register',
  config = 'config'
}

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
  schema?: {
    (joi: Joi.Root): Joi.Schema
  }
  onChange?: string | typeof Function
}

export interface IPlugin {
  id: string
  key: string
  path: string
  apply: () => any
  config?: IPluginConfig
  isPreset?: boolean
  enableBy?: EnumEnableBy | (() => void)
}

export interface IHook {
  key: string
  fn: (args?: { args: any }, option?: any) => Promise<any> | void
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

export type IServicePathKeys =
  | 'cwd'
  | 'appNodeModulesPath'
  | 'appOutputPath'
  | 'appSrcPath'
  | 'appPagesPath'

export type IServicePaths = {
  [key in IServicePathKeys]: string
}

export interface IHTMLTag {
  [key: string]: string
}

export interface IModifyHTML {
  (memo: any, args?: any): Promise<any>
}

export interface IAddHTML<T> {
  (memo: T): Promise<T>
}

export interface IScript extends Partial<HTMLScriptElement> {
  content?: string
}
export interface IStyle extends Partial<HTMLStyleElement> {
  content: string
}

export type IScriptConfig = Array<IScript | string>
export type IStyleConfig = Array<IStyle | string>

export interface IOpts {
  config: IConfig
  tplPath?: string
  addHTMLHeadScripts?: IAddHTML<IHTMLTag[]>
  addHTMLScripts?: IAddHTML<IHTMLTag[]>
  addHTMLMetas?: IAddHTML<IHTMLTag[]>
  addHTMLLinks?: IAddHTML<Partial<HTMLLinkElement>[]>
  addHTMLStyles?: IAddHTML<Partial<IStyle>[]>
  modifyHTML?: IModifyHTML
}

export interface ILink {
  [key: string]: string
}

export interface IHtmlConfig {
  metas?: IHTMLTag[]
  links?: Partial<HTMLLinkElement>[]
  styles?: Partial<IStyle>[]
  headScripts?: IHTMLTag[]
  scripts?: IHTMLTag[]
}

export interface IGetContentArgs extends IHtmlConfig {
  headJSFiles?: string[]
  jsFiles?: string[]
  cssFiles?: string[]
  tplPath?: string
  modifyHTML?: IModifyHTML
}
