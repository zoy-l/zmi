import { portfinder, prepareUrls, clearConsole, chalk } from '@zmi/utils'
import webpackDevSever from 'webpack-dev-server'
import webpack from 'webpack'

import createCompiler from './createCompiler'
import getConfig from './getConfig'

class Bundler {
  cwd: string
  config: any

  constructor({ cwd, config }: any) {
    this.cwd = cwd
    this.config = config
  }

  getConfig() {
    return getConfig({})
  }

  async setupDevServer() {
    if (process.env.PORT) {
    }
    const port = await portfinder.getPortPromise({ port: 6060 })
    const urls = prepareUrls({ host: '0.0.0.0', port })
    const config = this.getConfig()
    const compiler = createCompiler({
      port,
      urls,
      config,
      appName: 'app'
    })

    const devServer = new webpackDevSever(compiler, config.devServer)

    devServer.listen(port, urls.localUrlForTerminal, (err) => {
      if (err) {
        return console.log(err)
      }
      clearConsole()
      console.log()
      console.log(chalk.blue('🎯 Speed ​​up the server,Wait a minute...'))
    })

    return
  }
}
