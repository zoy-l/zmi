import { Core } from 'hins'

import type { IPackage, IServiceOptions, IServicePaths } from './types'
import babelRegister from './babelRegister'
import paths from './paths'

export default class Service extends Core {
  /**
   * @param {String} paths.cwd
   * @param {String} paths.appOutputPath
   * @param {String} paths.appSrcPath
   * @param {String} paths.appPagesPath
   * @param {String} paths.appNodeModulesPath
   * @desc Path to the workspace
   */
  paths: IServicePaths

  /**
   * @param {Object} any[]
   * @desc Package.json of the workspace
   */
  pkg?: IPackage

  /**
   * @param {String}
   * @desc Environment variable
   */
  env?: string

  constructor(options: IServiceOptions) {
    super({ ...options, babelRegister, possibleConfigName: ['.zmirc.js', '.zmirc.ts'] })
    this.paths = paths({ cwd: options.cwd })
    this.pkg = options.pkg
  }
}
