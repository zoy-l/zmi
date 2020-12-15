import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import WebpackChain from 'webpack-chain'
import defaultWebpack from 'webpack'
import { paths } from '@zmi/utils'
import path from 'path'

import RuleCss from './ruleCss'

export interface IGetConfigOpts {
  type: any
  cwd: string
  config: any
  hot?: boolean
  port?: number
  targets?: any
  browserslist?: any
  entry?: {
    [key: string]: string
  }
  __disableTerserForTest?: boolean
  env: 'development' | 'production'
  miniCSSExtractPluginPath?: string
  babelOpts?: Record<string, unknown>
  miniCSSExtractPluginLoaderPath?: string
  babelOptsForDep?: Record<string, unknown>
  bundleImplementor?: typeof defaultWebpack
  chainWebpack?: (webpackConfig: any, args: any) => Promise<any>
  modifyBabelOpts?: (opts: Record<string, unknown>) => Promise<any>
  modifyBabelPresetOpts?: (opts: Record<string, unknown>) => Promise<any>
}

export default async function getConfig(opts: IGetConfigOpts) {
  const {
    env,
    config,
    cwd,
    hot,
    type,
    entry = {},
    bundleImplementor = defaultWebpack,
    miniCSSExtractPluginLoaderPath
  } = opts

  const isDev = env === 'development'
  const isProd = env === 'production'

  let webpackConfig = new WebpackChain()
  const createCSSRule = new RuleCss({
    webpackConfig,
    config,
    isDev,
    type,
    // browserslist,
    miniCSSExtractPluginLoaderPath
  })

  // Set css
  createCSSRule.step()

  // const disableCompress = process.env.COMPRESS === 'none'

  const { devtool } = config

  webpackConfig.devtool(
    !isDev
      ? devtool
      : devtool === false
      ? false
      : devtool ?? 'cheap-module-source-map'
  )

  const appOutputPath = path.join(cwd, config.outputPath ?? 'dist')
  const useHash = config.hash && isProd

  webpackConfig.when(!!entry, (WConfig) => {
    Object.keys(entry).forEach((key) => {
      const entryPoint = WConfig.entry(key)

      entryPoint.add(entry[key])
    })
  })

  webpackConfig.output
    .path(appOutputPath)
    .filename(useHash ? '[name].[contenthash:8].js' : '[name].js')
    .chunkFilename(useHash ? '[name].[contenthash:8].js' : '[name].js')
    .publicPath(config.publicPath)

  // To be verified .set('symlinks', true)
  webpackConfig.resolve.modules
    .add('node_modules')
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

  if (opts.chainWebpack) {
    webpackConfig = await opts.chainWebpack(webpackConfig, {
      createCSSRule: createCSSRule.createCSSRule,
      webpack: bundleImplementor,
      type
    })
  }

  // Turn on react fast refresh
  // Official implementation
  // And also added in cra 4.0
  // https://github.com/pmmmwh/react-refresh-webpack-plugin
  webpackConfig.when(isDev && !!hot, (WConfig) => {
    WConfig.plugin('hmr').use(ReactRefreshWebpackPlugin)
  })

  // IgnorePlugin ignores localized content when packaging
  // https://www.webpackjs.com/plugins/ignore-plugin/
  // prettier-ignore
  webpackConfig.when(config.ignoreMomentLocale, (WConfig) => {
    WConfig.plugin('ignore-moment-locale').use(bundleImplementor.IgnorePlugin,
      [{
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }])
  })

  webpackConfig.when(config.externals, (WConfig) => {
    WConfig.externals(config.externals)
  })

  webpackConfig.when(config.alias, (WConfig) => {
    Object.keys(config.alias).forEach((key) => {
      WConfig.resolve.alias.set(key, config.alias![key])
    })
  })

  webpackConfig.plugin('ForkTsChecker').use(ForkTsCheckerWebpackPlugin)

  // webpackConfig.externals

  let WTarget = webpackConfig.toConfig()

  // && type === BundlerConfigType.csr
  if (process.env.SPEED_MEASURE) {
    const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
    // prettier-ignore
    // https://github.com/stephencookdev/speed-measure-webpack-plugin
    const smpOption = process.env.SPEED_MEASURE === 'CONSOLE'
        ? { outputFormat: 'human', outputTarget: console.log }
        : { outputFormat: 'json', outputTarget: path.join(process.cwd(), 'speed-measure.json')}
    const smp = new SpeedMeasurePlugin(smpOption)
    WTarget = smp.wrap(WTarget)
  }

  return WTarget
}
