import { PluginType } from './enums'
import { resolve, compatibleWithESModule } from '@lim/cli-utils'

function getPluginsOrPresets(type: any, opts: any) {
  return [
    opts[type === PluginType.preset ? 'presets' : 'plugins'] ?? [],
    opts[type === PluginType.preset ? 'userConfigPresets' : 'userConfigPlugins'] ?? []
  ]
    .flat()
    .map((path) =>
      resolve.sync(path, {
        basedir: opts.cwd,
        extensions: ['.js', '.ts']
      })
    )
}

export function pathToRegister({ type, path, cwd }: { type: any; path: string; cwd: string }) {
  let id = '@lim/cli-preset/src/plugins/commands/dev'
  let key = 'dev'
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

export function resolvePlugins() {
  const type = PluginType.plugin
}
