import { PluginAPI } from '@zmi/core'

export enum BundlerConfigType {
  csr = 'csr',
  ssr = 'ssr'
}

export interface IApi extends PluginAPI {}
