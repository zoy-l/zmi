import { lodash, slash } from '@zmi-cli/utils'
import path from 'path'
import fs from 'fs'

import { IServicePaths } from './types'

interface IServicePath {
  outputPath?: string
  env?: string
  cwd: string
}

function isDirectoryAndExist(path: string) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory()
}

function normalizeWithWinPath<T extends Record<string, string>>(obj: T) {
  return lodash.mapValues(obj, (value: string) => slash(value))
}

export default function servicePath(options: IServicePath): IServicePaths {
  const { cwd, outputPath } = options
  let appSrcPath = cwd

  if (isDirectoryAndExist(path.join(cwd, 'src'))) {
    appSrcPath = path.join(cwd, 'src')
  }

  return normalizeWithWinPath({
    cwd,
    appNodeModulesPath: path.join(cwd, 'node_modules'),
    appOutputPath: path.join(cwd, outputPath ?? 'dist'),
    appSrcPath,
    appPagesPath: path.join(appSrcPath, 'pages')
  })
}
