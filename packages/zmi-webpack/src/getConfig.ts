import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import { chalk, clearConsole, paths } from '@zmi/utils'
import WebpackChain from 'webpack-chain'
import defaultWebpack from 'webpack'
import path from 'path'

import RuleCss from './ruleCss'
import { getBabelOpts, getBabelPresetOpts } from './getBabelOptions'
import getTargetsAndBrowsersList from './getTargetsAndBrowsersList'

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
    hot = true,
    type,
    port,
    entry = {},
    bundleImplementor = defaultWebpack,
    miniCSSExtractPluginLoaderPath
  } = opts
  const { targets } = getTargetsAndBrowsersList({
    config,
    type
  })

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
  webpackConfig.mode(env)

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

  const presetOpts = getBabelPresetOpts({
    config,
    env,
    targets
  })

  const babelOpts = getBabelOpts({
    config,
    presetOpts
  })

  webpackConfig.module
    .rule('js')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include.add(cwd)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .options(babelOpts)

  webpackConfig.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
    .use('url-loader')
    .loader('url-loader')
    .options({})

  webpackConfig.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    })

  webpackConfig.module
    .rule('fonts')
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    })

  webpackConfig.module
    .rule('plaintext')
    .test(/\.(txt|text|md)$/)
    .use('raw-loader')
    .loader('raw-loader')

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

  webpackConfig
    .plugin('ForkTsChecker')
    .use(ForkTsCheckerWebpackPlugin, [{ async: false }])
  webpackConfig.plugin('ProgressBarPlugin').use(ProgressBarPlugin, [
    {
      total: 15,
      summary: false,
      complete: '▇',
      format: `🚧  ${chalk.cyan.bold(':bar ')}${chalk.cyan.bold(
        ':percent'
      )}  ${chalk.grey.bold('( :elapseds )')}`,
      customSummary: (time) => {
        clearConsole()
        console.log(chalk.blue.bold(`🎯 Compiled time ${time} \n`))
      }
    }
  ])

  // webpackConfig.externals

  let WTarget = webpackConfig.toConfig()

  // && type === BundlerConfigType.csr
  if (process.env.SPEED_MEASURE) {
    // https://github.com/stephencookdev/speed-measure-webpack-plugin
    const smp = new SpeedMeasurePlugin(
      process.env.SPEED_MEASURE === 'CONSOLE'
        ? { outputFormat: 'human', outputTarget: console.log }
        : {
            outputFormat: 'json',
            outputTarget: path.join(process.cwd(), 'speed-measure.json')
          }
    )
    WTarget = smp.wrap(WTarget)
  }

  WTarget.devServer = {
    hot,
    port,
    clientLogLevel: 'silent',
    noInfo: true,
    inline: true,
    stats: 'none',
    contentBase: paths('dist')
  }

  return WTarget
}
