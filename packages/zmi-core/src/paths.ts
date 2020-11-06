import path from 'path'
import fs from 'fs'
import { lodash, winPath } from '@zmi/utils'
import { IServicePaths } from './types'
import { IConfig } from './Service'

interface IServicePath {
  config: IConfig & { singular?: boolean; outputPath?: string }
  env?: string
  cwd: string
}

function isDirectoryAndExist(path: string) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory()
}

function normalizeWithWinPath<T extends Record<string, string>>(obj: T) {
  return lodash.mapValues(obj, (value) => winPath(value))
}

export default function servicePath(options: IServicePath): IServicePaths {
  const { cwd, config } = options
  let appSrcPath = cwd

  if (isDirectoryAndExist(path.join(cwd, 'src'))) {
    appSrcPath = path.join(cwd, 'src')
  }

  const appPagesPath = config.singular
    ? path.join(appSrcPath, 'page')
    : path.join(appSrcPath, 'pages')

  return normalizeWithWinPath({
    cwd,
    appNodeModulesPath: path.join(cwd, 'node_modules'),
    appOutputPath: path.join(cwd, config.outputPath ?? './dist'),
    appSrcPath,
    appPagesPath
  })
}
