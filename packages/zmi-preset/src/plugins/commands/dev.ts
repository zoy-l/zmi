import { portfinder } from '@zmi/utils'

export default (api: any) => {
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

      console.log(port, host)
    }
  })
}
