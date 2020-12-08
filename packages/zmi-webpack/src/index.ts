import WebpackDevServer from 'webpack-dev-server'
import defaultWebpack from 'webpack'

import createCompiler, { prepareUrls } from './createCompiler'
import getConfig, { IGetConfigOpts } from './getConfig'

interface ISetupOpts {
  bundleConfigs: defaultWebpack.Configuration
  bundleImplementor?: typeof defaultWebpack
  port: number
  host: string
}

export default class Bundler {
  cwd: string

  config: any

  constructor({ cwd, config }: any) {
    this.cwd = cwd
    this.config = config
  }

  async getConfig(options: IGetConfigOpts) {
    return getConfig({ ...options, cwd: this.cwd, config: this.config })
  }

  async setupDevServer(options: ISetupOpts) {
    const {
      bundleConfigs,
      bundleImplementor = defaultWebpack,
      host,
      port
    } = options

    const { devServer: devServerConifg } = this.config
    const urls = prepareUrls(null, host, port)

    const compiler = createCompiler({
      config: bundleConfigs,
      bundleImplementor,
      appName: '',
      urls,
      port
    })

    // This should be webpack-dev-server types error
    // I'm not sure, I didn't find relevant information
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const devServer = new WebpackDevServer(compiler, devServerConifg ?? {})

    return {
      onListening: () => {},
      devServer: (callback: (err: Error | undefined) => void) => {
        return devServer.listen(port, host, callback)
      }
    }
  }
}
