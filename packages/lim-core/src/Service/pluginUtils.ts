import {
  resolve,
  compatibleWithESModule,
  assert,
  pkgUp,
  lodash,
  winPath
} from '@lim/utils'

import fs from 'fs'
import path from 'path'

import { PluginType } from './enums'

function getPluginsOrPresets(type: any, opts: any) {
  return [opts.plugins ?? [], opts.userConfigPlugins ?? []].flat().map((path) =>
    resolve.sync(path, {
      basedir: opts.cwd,
      extensions: ['.js', '.ts']
    })
  )
}

function nameToKey(name: string) {
  debugger
  return name
    .split('.')
    .map((part) => lodash.camelCase(part))
    .join('.')
}

function pkgNameToKey(pkgName: string) {
  // strip none @lim scope
  if (pkgName.charAt(0) === '@' && !pkgName.startsWith('@lim/')) {
    pkgName = pkgName.split('/')[1]
  }
  debugger
  return nameToKey(pkgName.replace(/^(@lim\/|lim-)plugin-/, ''))
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
    fs.existsSync(pluginPath),
    `${pluginPath} not exists, pathToRegister failed`
  )

  const pkgJSONPath = pkgUp.sync({ cwd: pluginPath })
  debugger
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
  id = id.replace('@lim/preset/lib/plugins', '@@')
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
        assert(false, `Register ${pluginPath} failed, since ${err.message}`)
      }
    }
  }
}

export function resolvePresets(opts: any) {
  const type = PluginType.preset
  const presets = [...getPluginsOrPresets(type, opts)]

  return presets.map((path) => pathToRegister({ path, cwd: opts.cwd }))
}

export function resolvePlugins(opts: any) {
  const type = PluginType.plugin
  let plugins = getPluginsOrPresets(type, opts)
  plugins = Array.isArray(plugins) ? [...plugins] : plugins
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
