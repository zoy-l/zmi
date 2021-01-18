import { IApi } from '@zmi/types'
import { assert, chalk, portfinder, clearConsole } from '@zmi/utils'

import { getBundleAndConfigs } from './BundleUtils'

export default async (api: IApi) => {
  let port: number
  let host: string

  api.registerCommand({
    name: 'dev',
    description: 'start a dev server for development',
    fn: async ({ args }) => {
      const defaultPort =
        process.env.PORT ?? args?.port ?? api.config.devServer?.port

      port = await portfinder.getPortPromise({ port: defaultPort })
      host = process.env.HOST ?? api.config.devServer?.host ?? '0.0.0.0'

      const {
        bundler,
        bundleConfigs,
        bundleImplementor
      } = await getBundleAndConfigs({ api, port })

      const devServer = await bundler.setupDevServer({
        port,
        host,
        bundleConfigs,
        bundleImplementor,
        appName: api.pkg.name
      })

      devServer.listen(port, host, (err: Error | undefined) => {
        if (err) {
          return console.log(err)
        }
        clearConsole()
        console.log()
        console.log(chalk.blue(`Speed up the server,Wait a minute...\n`))
      })
    }
  })

  api.registerMethod({
    name: 'getPort',
    fn() {
      assert(
        `api.getPort() is only valid in development.`,
        api.env === 'development'
      )
      return port
    }
  })

  api.registerMethod({
    name: 'getHostname',
    fn() {
      assert(
        `api.getHostname() is only valid in development.`,
        api.env === 'development'
      )
      return host
    }
  })

  api.registerMethod({
    name: 'restartServer',
    fn() {
      console.log(chalk.gray(`🎯 Try to restart dev server...`))
      process.send && process.send({ type: 'RESTART' })
    }
  })
}
