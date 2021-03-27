import { IApi as IHinsApi } from 'hins'

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
  outputPath?: string
  env?: string
  cwd: string
}

export interface IServiceOptions {
  plugins?: string[]
  pkg?: IPackage
  env?: Record<string, any>
  cwd: string
}

export interface IPackage {
  name?: string
  dependencies?: Record<string, any>
  devDependencies?: Record<string, any>
  [key: string]: any
}

export interface IApi extends IHinsApi {
  paths: IServicePaths
}
