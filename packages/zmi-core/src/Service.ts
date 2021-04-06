import { Core } from 'hins'

import type { IPackage, IServiceOptions, IServicePaths } from './types'
import babelRegister from './babelRegister'
import paths from './paths'

export default class Service extends Core {
  /**
   * @param object
   * @desc Path to the workspace
   */
  paths: IServicePaths

  /**
   * @param object
   * @desc Package.json of the workspace
   */
  pkg?: IPackage

  /**
   * @param String
   * @desc Environment variable
   */
  env?: string

  constructor(options: IServiceOptions) {
    super({ ...options, babelRegister, possibleConfigName: ['.zmirc.js', '.zmirc.ts'] })
    this.paths = paths({ cwd: options.cwd })
    this.pkg = options.pkg
  }
}
