import forkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import webpack from 'webpack'
import webpackChain from 'webpack-chain'

export default function getConfig(opts: any) {
  const { env, config } = opts

  const webpackConfig = new webpackChain()

  const isDev = env === 'development'
  const isProd = env === 'production'

  const devtool = config.devtool

  webpackConfig.devtool(
    isDev ? devtool !== false || devtool || 'cheap-module-source-map' : devtool
  )

  webpackConfig.output

  webpackConfig.resolve

  webpackConfig.module.rule()

  webpackConfig.externals

  webpackConfig.plugin

  webpackConfig.when
}
