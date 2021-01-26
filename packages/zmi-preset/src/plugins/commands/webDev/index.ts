import { assert, chalk, portfinder, clearConsole } from '@zmi/utils'
import { IApi } from '@zmi/types'

import { getBundleAndConfigs } from '../../common/BundleUtils'

export default (api: IApi) => {
  let port: number
  let host: string

  api.registerCommand({
    name: 'webDev',
    description: 'start a webDev server for development',
    fn: async ({ args }) => {
      const defaultPort = process.env.PORT ?? args?.port ?? api.config.devServer?.port

      port = await portfinder.getPortPromise({ port: defaultPort })
      host = process.env.HOST ?? api.config.devServer?.host ?? '0.0.0.0'

      const { bundler, bundleConfigs, bundleImplementor } = await getBundleAndConfigs({
        api,
        port
      })

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
        console.log(
          chalk.bgBlueBright.black(' SPEED '),
          chalk.blueBright(`up the server,Wait a minute...\n`)
        )
      })
    }
  })

  api.registerMethod({
    name: 'getPort',
    fn() {
      assert(`api.getPort() is only valid in development.`, api.env === 'development')
      return port
    }
  })

  api.registerMethod({
    name: 'getHostname',
    fn() {
      assert(`api.getHostname() is only valid in development.`, api.env === 'development')
      return host
    }
  })

  api.registerMethod({
    name: 'restartServer',
    fn() {
      process.send?.({ type: 'RESTART' })
      console.log(chalk.gray(`🎯 Try to restart dev server...`))
    }
  })
}
