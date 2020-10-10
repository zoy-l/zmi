import webpackDevSever from 'webpack-dev-server'
import webpack from 'webpack'
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

  // setupDevServer({
  //   bundleConfigs,
  //   bundleImplementor = webpack
  // }): {
  //   bundleConfigs: webpack.Configuration[]
  //   bundleImplementor?: typeof webpack
  // } {

  //   return
  // }
}
