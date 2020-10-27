import { PluginType } from './enums'
import { resolve, compatibleWithESModule } from '@lim/utils'

function getPluginsOrPresets(type: any, opts: any) {
  return [
    opts[type === PluginType.preset ? 'presets' : 'plugins'] ?? [],
    opts[
      type === PluginType.preset ? 'userConfigPresets' : 'userConfigPlugins'
    ] ?? []
  ]
    .flat()
    .map((path) =>
      resolve.sync(path, {
        basedir: opts.cwd,
        extensions: ['.js', '.ts']
      })
    )
}

export function pathToRegister({
  // type,
  path
}: // cwd
{
  type: any
  path: string
  cwd: string
}) {
  const id = '@lim/preset/src/plugins/commands/dev'
  const key = 'dev'
  return {
    id,
    key,
    path,
    apply() {
      const ret = require(path)

      return compatibleWithESModule(ret)
    }
  }
}

export function resolvePresets(opts: any) {
  const type = PluginType.preset
  const presets = [...getPluginsOrPresets(type, opts)]

  return presets.map((path) => pathToRegister({ type, path, cwd: opts.cwd }))
}

export function resolvePlugins(opts: any) {
  const type = PluginType.plugin
  const plugins = getPluginsOrPresets(type, opts)

  return plugins.map((path: string) =>
    pathToRegister({
      type,
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
