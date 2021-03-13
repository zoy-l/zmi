import { chalk, chokidar, clearConsole, lodash, slash } from '@zmi-cli/utils'
import { getPlugin } from '@zmi-cli/core'
import { IApi } from '@zmi-cli/types'
import path from 'path'
import fs from 'fs'

interface IChangeType {
  pluginChanged: any[]
  valueChanged: any[]
}

function getZmiPlugins(pkgPath: string) {
  let pkg: Record<string, any> = {}

  if (fs.existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    } catch (err) {
      throw new Error(err)
    }
  }
  return Object.keys({
    ...pkg.dependencies,
    ...pkg.devDependencies
  }).filter(getPlugin)
}

function watcher(cwd: string, onChange: { (): void }) {
  const pkgPath = path.join(cwd, 'package.json')
  const plugins = getZmiPlugins(pkgPath)
  const chokidarInstance = chokidar.watch(pkgPath, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 500
    }
  })

  chokidarInstance.on('all', () => {
    const usePlugins = getZmiPlugins(pkgPath)
    !lodash.isEqual(plugins, usePlugins) && onChange()
  })
}

function watchPkg(cwd: string, onChange: { (): void }) {
  watcher(cwd, onChange)

  if (slash(cwd) !== slash(process.cwd())) {
    watcher(process.cwd(), onChange)
  }
}

export default (api: IApi) => {
  function restartServer(desc: string) {
    clearConsole()
    console.log(chalk.bgGray(' RESTART '), desc)
    console.log()
    api.restartServer()
  }

  api.registerCommand({
    name: 'dev',
    description: 'start dev server for development',
    async fn({ args }) {
      api.env = 'development'
      process.env.NODE_ENV = 'development'

      api.service.runCommand({ command: 'webDev', args })

      const watch = process.env.WATCH !== 'none'

      if (watch) {
        watchPkg(api.cwd, () => {
          restartServer(`Plugins in package.json changed.`)
        })

        const { configInstance, initConifg } = api.service
        configInstance.watch({
          userConfig: initConifg,
          async onChange(options: IChangeType) {
            const { pluginChanged, valueChanged } = options
            if (pluginChanged.length) {
              restartServer(`Plugins of ${pluginChanged.map((p) => p.key).join(', ')} changed.`)
            }

            if (valueChanged.length) {
              let reload = false
              const funcs: (() => void)[] = []
              const reloadConfigs: string[] = []
              valueChanged.forEach(({ key, pluginId }) => {
                const { onChange } = api.service.plugins[pluginId].config ?? {}
                if (!onChange || onChange === api.ConfigChangeType.reload) {
                  reload = true
                  reloadConfigs.push(key)
                }
                if (typeof onChange === 'function') {
                  funcs.push(onChange)
                }
              })
              if (reload) {
                restartServer(`Config ${reloadConfigs.join(', ')} changed.`)
              } else {
                api.service.initConifg = configInstance.getUserConfig()

                const defaultConfig = await api.applyPlugins({
                  key: 'modifyDefaultConfig',
                  type: api.ApplyPluginsType.modify,
                  initialValue: configInstance.getDefaultConfig()
                })
                api.service.config = await api.applyPlugins({
                  key: 'modifyConfig',
                  type: api.ApplyPluginsType.modify,
                  initialValue: configInstance.getConfig({
                    defaultConfig
                  })
                })
                funcs.forEach((fn) => fn())
              }
            }
          }
        })
      }
    }
  })
}
