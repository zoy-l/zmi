import { compatibleWithESModule, flatDeep, resolve, slash, lodash, pkgUp } from '@zmi-cli/utils'
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { IPackage } from './types'

interface IResolvePluginsOpts {
  pkg: IPackage
  cwd: string
  plugins: string[]
  userConfigPlugins: string[]
}

function getPlugins(opts: IResolvePluginsOpts) {
  return flatDeep([
    opts.plugins,
    opts.userConfigPlugins ?? [],
    Object.keys(opts.pkg.devDependencies ?? {})
      .concat(Object.keys(opts.pkg.dependencies ?? {}))
      .filter((name) => {
        const hasScope = name.charAt(0) === '@'
        const re = /^(@zmi\/|zmi-)plugin-/
        if (hasScope) {
          return re.test(name.split('/')[1]) ?? re.test(name)
        }
        return re.test(name)
      })
  ]).map((path) =>
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
  // strip none @zmi-cli scope
  if (pkgName.charAt(0) === '@' && !pkgName.startsWith('@zmi-cli/')) {
    pkgName = pkgName.split('/')[1]
  }

  return nameToKey(pkgName.replace(/^(@zmi-cli\/|zmi-)plugin-/, ''))
}

export function pathToRegister({ path: pluginPath, cwd }: { path: string; cwd: string }) {
  let pkg = null
  let isPkgPlugin = false

  assert(fs.existsSync(pluginPath), `${pluginPath} not exists, pathToRegister failed`)

  const pkgJSONPath = pkgUp.sync({ cwd: pluginPath })
  /* istanbul ignore next */
  if (pkgJSONPath) {
    pkg = require(pkgJSONPath)
    isPkgPlugin =
      slash(path.join(path.dirname(pkgJSONPath), pkg.main || 'index.js')) === slash(pluginPath)
  }

  let id
  if (isPkgPlugin) {
    id = pkg!.name
  } else if (slash(pluginPath).startsWith(slash(cwd))) {
    id = `./${slash(path.relative(cwd, pluginPath))}`
  } /* istanbul ignore next */ else if (pkgJSONPath) {
    id = slash(path.join(pkg!.name, path.relative(path.dirname(pkgJSONPath), pluginPath)))
  } else {
    /* istanbul ignore next */
    id = slash(pluginPath)
  }
  id = id.replace('@zmi-cli/preset/lib/plugins', '@@')
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
    path: slash(pluginPath),
    apply() {
      try {
        const ret = require(pluginPath)
        return compatibleWithESModule(ret)
      } catch (err) {
        throw new Error(`Register plugin ${path} failed, since ${err.message}`)
      }
    }
  }
}

export function resolvePlugins(opts: IResolvePluginsOpts) {
  return [...getPlugins(opts)].map((path: string) =>
    pathToRegister({
      path,
      cwd: opts.cwd
    })
  )
}
