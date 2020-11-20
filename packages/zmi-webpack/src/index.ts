// import { portfinder, prepareUrls, clearConsole, chalk } from '@zmi/utils'
// import webpackDevSever from 'webpack-dev-server'
import defaultWebpack from 'webpack'

// import createCompiler from './createCompiler'
import getConfig, { IGetConfigOpts } from './getConfig'

interface ISetupOpts {
  bundleConfigs: defaultWebpack.Configuration[]
  bundleImplementor?: typeof defaultWebpack
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
    const { bundleConfigs, bundleImplementor = defaultWebpack } = options

    const compiler = bundleImplementor(bundleConfigs)

    return {
      onListening: () => {},
      compiler
    }
    // if (process.env.PORT) {
    // }
    // const port = await portfinder.getPortPromise({ port: 6060 })
    // const urls = prepareUrls({ host: '0.0.0.0', port })
    // // const config = await this.getConfig()
    // const compiler = createCompiler({
    //   port,
    //   urls,
    //   // config,
    //   appName: 'app'
    // })s
    // const devServer = new webpackDevSever(compiler, config.devServer)
    // devServer.listen(port, urls.localUrlForTerminal, (err) => {
    //   if (err) {
    //     return console.log(err)
    //   }
    //   clearConsole()

    //   console.log()

    // })
    // return
  }
}
