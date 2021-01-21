import WebpackDevServer from 'webpack-dev-server'
import defaultWebpack from 'webpack'

import createCompiler, { prepareUrls } from './createCompiler'
import getConfig, { IGetConfigOpts } from './getConfig'

interface ISetupOpts {
  bundleConfigs: defaultWebpack.Configuration
  bundleImplementor?: typeof defaultWebpack
  port: number
  host: string
  appName?: string
}

interface IOpts {
  cwd: string
  config: any
  pkg: Record<string, any>
}

export default class Bundler {
  cwd: string

  config: any

  pkg = {}

  constructor({ cwd, config, pkg }: IOpts) {
    this.cwd = cwd
    this.config = config
    this.pkg = pkg
  }

  async getConfig(options: IGetConfigOpts) {
    return getConfig({
      ...options,
      cwd: this.cwd,
      config: this.config,
      pkg: this.pkg
    })
  }

  async setupDevServer(options: ISetupOpts) {
    const {
      bundleConfigs,
      bundleImplementor = defaultWebpack,
      appName = 'project',
      host,
      port
    } = options

    const urls = prepareUrls({ host, port })

    const { devServer: devServerConfig } = bundleConfigs

    const compiler = createCompiler({
      config: bundleConfigs,
      bundleImplementor,
      appName,
      urls,
      port
    })

    const devServer = new WebpackDevServer(compiler, devServerConfig)

    return devServer
  }
}
