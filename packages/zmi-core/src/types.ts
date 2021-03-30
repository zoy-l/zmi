import { Hins } from 'hins'

type ICwd = string

export type IServicePathKeys =
  | 'cwd'
  | 'appNodeModulesPath'
  | 'appOutputPath'
  | 'appSrcPath'
  | 'appPagesPath'

export type IServicePaths = {
  [key in IServicePathKeys]: string
}

export interface IServicePath {
  outputPath?: ICwd
  env?: string
  cwd: ICwd
}

export interface IPackage {
  name?: string
  dependencies?: Record<string, any>
  devDependencies?: Record<string, any>
  [key: string]: any
}

export interface IServiceOptions {
  plugins?: string[]
  pkg: IPackage
  env?: Record<string, any>
  cwd: ICwd
}

export interface IService extends Hins {
  paths: IServicePaths
  pkg: IServiceOptions['pkg']
  env?: string
}
