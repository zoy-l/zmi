import WebpackDevServer from 'webpack-dev-server'
import defaultWebpack from 'webpack'

import createCompiler, { prepareUrls } from './createCompiler'
import getConfig, { IGetConfigOpts } from './getConfig'

interface ISetupOpts {
  bundleConfigs: defaultWebpack.Configuration
  bundleImplementor?: typeof defaultWebpack
  port: number
  host: string
  appName: string
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
      port,
      appName
    } = options

    const urls = prepareUrls({ host, port })

    const compiler = createCompiler({
      config: bundleConfigs,
      bundleImplementor,
      appName,
      urls,
      port
    })

    return {
      compiler,
      DevServer: WebpackDevServer
    }
  }
}
