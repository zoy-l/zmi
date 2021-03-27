import { Core } from 'hins'

import type { IPackage, IServiceOptions, IServicePaths } from './types'
import babelRegister from './BabelRegister'
import paths from './paths'

export default class Service extends Core {
  paths: IServicePaths

  pkg?: IPackage

  env?: string

  constructor(options: IServiceOptions) {
    super({ ...options, babelRegister })
    this.paths = paths({ cwd: options.cwd })
    this.pkg = options.pkg
  }
}
