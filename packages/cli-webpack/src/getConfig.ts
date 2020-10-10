import forkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import webpack from 'webpack'
import webpackChain from 'webpack-chain'

import path from 'path'

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
    .set('symlinks', true)
    .modules.add('node_modules')
    .add(path.join(__dirname, '../../node_modules'))
    .end()

  if (config.alias) {
    Object.keys(config.alias).forEach((key) => {
      webpackConfig.resolve.alias.set(key, config.alias![key])
    })
  }

  webpackConfig.module.rule()

  webpackConfig.externals

  webpackConfig.plugin

  webpackConfig.when
}
