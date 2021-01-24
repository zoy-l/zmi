import { IApi } from '@zmi/types'
import { chokidar, lodash, winPath } from '@zmi/utils'
import { getPlugin } from '@zmi/core'
import path from 'path'
import fs from 'fs'

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
    ignoreInitial: true
  })

  chokidarInstance.on('all', () => {
    const usePlugins = getZmiPlugins(pkgPath)
    !lodash.isEqual(plugins, usePlugins) && onChange()
  })

  return chokidarInstance.close
}

function watchPkg(cwd: string, onChange: { (): void }) {
  const unWatchs = [watcher(cwd, onChange)]

  if (winPath(cwd) !== winPath(process.cwd())) {
    unWatchs.push(watcher(process.cwd(), onChange))
  }

  return () => {
    unWatchs.forEach((unWatch) => {
      unWatch()
    })
  }
}

export default (api: IApi) => {
  const unwatchs: { (): void }[] = []

  api.registerCommand({
    name: 'dev',
    description: 'start dev server for development',
    async fn({ args }) {
      const { miniAppConfig, frameType } = api.config
      let FrameType = frameType

      if (!FrameType) {
        if (miniAppConfig) {
          FrameType = 'miniApp'
        } else {
          const projectConfig = [
            fs.existsSync(`${api.paths.appSrcPath}/project.config.json`),
            fs.existsSync(`${api.paths.appSrcPath}/app.json`)
          ].some(Boolean)

          let isWeb = false
          if (api.pkg?.dependencies) {
            isWeb = Object.keys(api.pkg?.dependencies).some((name) =>
              ['react', 'vue'].includes(name)
            )
          }

          if (isWeb && projectConfig) {
            throw new Error(
              `zmi can't determine it is a 'web/miniapp' environment, please specify 'frameType'`
            )
          }

          FrameType = projectConfig ? 'miniApp' : 'react'
        }
      }

      switch (FrameType) {
        case 'react':
        case 'vue':
          api.service.runCommand({ command: 'webDev', args })
          break
        case 'miniApp':
          api.service.runCommand({ command: 'miniAppDev', args })
          break
        default:
          break
      }

      const watch = process.env.WATCH !== 'none'

      if (watch) {
        //
        const unWatchPkg = watchPkg(api.cwd, () => {
          console.log()
          console.log(`Plugins in package.json changed.`)
          api.restartServer()
        })

        unwatchs.push(unWatchPkg)

        const { configInstance, userConfig } = api.service
        const unWatchConfig = configInstance.watch({
          userConfig,
          async onChange({ pluginChanged, valueChanged }: any) {
            if (pluginChanged.length) {
              console.log()
              console.log(
                `Plugins of ${pluginChanged.map((p: any) => p.key).join(', ')} changed.`
              )
              api.restartServer()
            }

            if (valueChanged.length) {
              // let reload = false
              // const fns: Function[] = []
              // const reloadConfigs: string[] = []
              // valueChanged.forEach(({ key, pluginId }) => {
              //   const { onChange } = api.service.plugins[pluginId].config || {}
              //   if (!onChange || onChange === api.ConfigChangeType.reload) {
              //     reload = true
              //     reloadConfigs.push(key)
              //   }
              //   if (typeof onChange === 'function') {
              //     fns.push(onChange)
              //   }
              // })
              // if (reload) {
              //   console.log()
              //   console.log(`Config ${reloadConfigs.join(', ')} changed.`)
              //   api.restartServer()
              // } else {
              //   api.service.userConfig = configInstance.getUserConfig()
              //   // TODO: simplify, 和 Service 里的逻辑重复了
              //   // 需要 Service 露出方法
              //   const defaultConfig = await api.applyPlugins({
              //     key: 'modifyDefaultConfig',
              //     type: api.ApplyPluginsType.modify,
              //     initialValue: configInstance.getDefaultConfig()
              //   })
              //   api.service.config = await api.applyPlugins({
              //     key: 'modifyConfig',
              //     type: api.ApplyPluginsType.modify,
              //     initialValue: configInstance.getConfig({
              //       defaultConfig
              //     }) as any
              //   })
              //   fns.forEach((fn) => fn())
              // }
            }
          }
        })
      }
    }
  })
}
