import {
  compatibleWithESModule,
  resolve,
  winPath,
  lodash,
  assert,
  pkgUp
} from '@zmi/utils'
import fs from 'fs'
import path from 'path'

import { IPackage } from './types'

interface IResolvePluginsOpts {
  pkg: IPackage
  cwd: string
  plugins: string[]
  userConfigPlugins: string[]
}

function getPlugins(opts: IResolvePluginsOpts) {
  return [opts.plugins ?? [], opts.userConfigPlugins ?? []].flat().map((path) =>
    resolve.sync(path, {
      basedir: opts.cwd,
      extensions: ['.js', '.ts']
    })
  )
}

function nameToKey(name: string) {
  return name
    .split('.')
    .map((part) => lodash.camelCase(part))
    .join('.')
}

function pkgNameToKey(pkgName: string) {
  // strip none @zmi scope
  if (pkgName.charAt(0) === '@' && !pkgName.startsWith('@zmi/')) {
    pkgName = pkgName.split('/')[1]
  }

  return nameToKey(pkgName.replace(/^(@zmi\/|zmi-)plugin-/, ''))
}

export function pathToRegister({
  path: pluginPath,
  cwd
}: {
  path: string
  cwd: string
}) {
  let pkg = null
  let isPkgPlugin = false

  assert(
    `${pluginPath} not exists, pathToRegister failed`,
    fs.existsSync(pluginPath)
  )

  const pkgJSONPath = pkgUp.sync({ cwd: pluginPath })

  if (pkgJSONPath) {
    pkg = require(pkgJSONPath)
    isPkgPlugin =
      winPath(path.join(path.dirname(pkgJSONPath), pkg.main || 'index.js')) ===
      winPath(pluginPath)
  }

  let id
  if (isPkgPlugin) {
    id = pkg!.name
  } else if (winPath(pluginPath).startsWith(winPath(cwd))) {
    id = `./${winPath(path.relative(cwd, pluginPath))}`
  } else if (pkgJSONPath) {
    id = winPath(
      path.join(pkg!.name, path.relative(path.dirname(pkgJSONPath), pluginPath))
    )
  } else {
    id = winPath(pluginPath)
  }
  id = id.replace('@zmi/preset/lib/plugins', '@@')
  id = id.replace(/\.js$/, '')

  let key

  if (isPkgPlugin) {
    key = pkgNameToKey(pkg.name)
  } else {
    const pathParse = path.parse(pluginPath)
    if (pathParse.name === 'index') {
      const sep = pathParse.dir.split(path.sep)
      key = sep[sep.length - 1]
    } else {
      key = nameToKey(path.basename(pluginPath, path.extname(pluginPath)))
    }
  }

  return {
    id,
    key,
    path: winPath(pluginPath),
    apply() {
      try {
        const ret = require(pluginPath)
        return compatibleWithESModule(ret)
      } catch (err) {
        assert(`Register ${pluginPath} failed, since ${err.message}`)
      }
    }
  }
}

export function resolvePlugins(opts: IResolvePluginsOpts) {
  let plugins = getPlugins(opts)
  plugins = [...plugins]
  debugger
  return plugins.map((path: string) =>
    pathToRegister({
      path,
      cwd: opts.cwd
    })
  )
}

export function isPromise(obj: any) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}
