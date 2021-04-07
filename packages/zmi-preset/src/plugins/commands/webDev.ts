import { chalk, portfinder, clearConsole } from '@zmi-cli/utils'
import { IApi } from '@zmi-cli/types'
import assert from 'assert'

import { getBundleAndConfigs } from '../common/BundleUtils'

export default (api: IApi) => {
  let port: number
  let host: string

  api.registerCommand({
    command: 'webDev',
    description: 'start a webDev server for development',
    fn: async ({ args = {} }) => {
      const defaultPort = process.env.PORT ?? args.port ?? api.initConfig.devServer.port

      port = await portfinder.getPortPromise({ port: defaultPort })
      host = process.env.HOST ?? api.initConfig.devServer.host ?? '0.0.0.0'

      const { bundler, bundleConfigs } = await getBundleAndConfigs({
        api,
        port
      })

      clearConsole()
      console.log(
        chalk.bgBlueBright.black(' SPEED '),
        chalk.blueBright(`up the server,Wait a minute...\n`)
      )

      const devServer = await bundler.setupDevServer({
        port,
        host,
        bundleConfigs,
        appName: api.pkg.name
      })

      devServer.listen(port, host, (err: Error | undefined) => {
        if (err) {
          console.log(err)
        }
      })

      api.core.watchConfig = {
        changeLog(event, paths, isReload) {
          isReload && console.log(chalk.bgBlue.black(` ${event} `), paths)
        },
        reloadLog() {
          devServer.close()
          console.log(`\n 🎯 Try to restart...`)
        }
      }

      api.configInstance.watchConfig()
    }
  })

  api.registerMethod({
    name: 'getPort',
    fn() {
      assert(api.env === 'development', `api.getPort() is only valid in development.`)
      return port
    }
  })

  api.registerMethod({
    name: 'getHostname',
    fn() {
      assert(api.env === 'development', `api.getHostname() is only valid in development.`)
      return host
    }
  })
}
