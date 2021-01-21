import { IApi } from '@zmi/types'
import fs from 'fs'

export default (api: IApi) => {
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
    }
  })
}
