import { assert, chalk, portfinder } from '@zmi/utils'

import { getBundleAndConfigs } from './BundleUtils'

export default async (api: any) => {
  let port: number
  let host: string

  api.registerCommand({
    name: 'dev',
    description: 'start a dev server for development',
    fn: async ({ args }: any) => {
      const defaultPort =
        process.env.PORT ?? args?.port ?? api.config.devServer?.port

      port = await portfinder.getPortPromise({ port: defaultPort })
      host = process.env.HOST ?? api.config.devServer?.host ?? '0.0.0.0'
      // const urls = prepareUrls({ host: '0.0.0.0', port })

      console.log(host)

      // const beforeMiddlewares = await api.applyPlugins({
      //   key: 'addBeforeMiddewares',
      //   type: api.ApplyPluginsType.add,
      //   initialValue: [],
      //   args: {}
      // })
      // const middlewares = await api.applyPlugins({
      //   key: 'addMiddewares',
      //   type: api.ApplyPluginsType.add,
      //   initialValue: [],
      //   args: {}
      // })

      const {
        bundler,
        bundleConfigs,
        bundleImplementor
      } = await getBundleAndConfigs({ api, port })

      const ServerOpts = await bundler.setupDevServer({
        bundleConfigs,
        bundleImplementor
      })

      ServerOpts.compiler
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

  // api.registerMethod({
  //   name: 'getServer',
  //   fn() {
  //     assert(
  //       `api.getServer() is only valid in development.`,
  //       api.env === 'development'
  //     )
  //     return server
  //   }
  // })

  api.registerMethod({
    name: 'restartServer',
    fn() {
      console.log(chalk.gray(`Try to restart dev server...`))
      // destroy()
      process.send?.({ type: 'RESTART' })
    }
  })
}
