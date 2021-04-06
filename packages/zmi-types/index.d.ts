import { createCSSRule, IStyle, WebpackChain, webpack } from '@zmi-cli/webpack'
import { IService } from '@zmi-cli/core'
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
}

interface IAdd<T> {
  (fn: () => T[] | T): void
}

export interface IApi extends IService {
  getPort: IGetter<number>
  getHostname: IGetter<string>

  onStart: IEvent<{ args: Record<string, any> }>
  onBuildComplete: IEvent<{
    err?: Error
    stats?: { stats: webpack.Stats[]; hash: string }
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
  modifyPaths: IModify<IService['paths'], null>
  modifyHTML: IModify<cheerio.Root, null>
}
