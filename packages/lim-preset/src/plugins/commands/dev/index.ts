import { portfinder } from '@lim/utils'
import Server from '@lim/server'

export default (api: any) => {
  let port: number
  let host: string
  let server: Server

  api.registerCommand({
    name: 'dev',
    description: 'start a dev server for development',
    fn: async ({ args }) => {
      const defaultPort =
        process.env.PORT ?? args?.port ?? api.config.devServer?.port

      port = await portfinder.getPortPromise({ port: defaultPort })
      host = process.env.HOST ?? api.config.devServer?.host ?? '0.0.0.0'
      // const urls = prepareUrls({ host: '0.0.0.0', port })

      return server.listen({
        port,
        hostname: host
      })
    }
  })
}
