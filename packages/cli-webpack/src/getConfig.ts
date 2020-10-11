import forkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import webpack from 'webpack'
import webpackChain from 'webpack-chain'
import { paths } from '@lim/cli-utils'
import path from 'path'

export default function getConfig(opts: any) {
  const { env, config, cwd, hot, port } = opts

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
    .add(paths('../../node_modules'))
    .end()

  webpackConfig.module
    .rule('js')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include.add(cwd)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))

  webpackConfig.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({})

  webpackConfig.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    })

  webpackConfig.module
    .rule('fonts')
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    })

  webpackConfig.module
    .rule('plaintext')
    .test(/\.(txt|text|md)$/)
    .use('raw-loader')
    .loader(require.resolve('raw-loader'))

  webpackConfig.when(isDev, (webpackConfig) => {
    if (hot) {
      webpackConfig.plugin('hmr').use(ReactRefreshWebpackPlugin)
    }
  })

  if (config.alias) {
    Object.keys(config.alias).forEach((key) => {
      webpackConfig.resolve.alias.set(key, config.alias![key])
    })
  }

  // webpackConfig.externals

  let ret = webpackConfig.toConfig()

  return ret
}
