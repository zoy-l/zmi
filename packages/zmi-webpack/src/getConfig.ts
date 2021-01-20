import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import miniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { chalk, paths } from '@zmi/utils'
import WebpackChain from 'webpack-chain'
import defaultWebpack from 'webpack'
import path from 'path'

import getTargetsAndBrowsersList from './getTargetsAndBrowsersList'
import { getBabelOpts } from './getBabelOptions'
import RuleCss from './ruleCss'
import VueClient from './VueClient'

export interface IGetConfigOpts {
  modifyBabelPresetOpts?: (opts: Record<string, unknown>) => Promise<any>
  modifyBabelOpts?: (opts: Record<string, unknown>) => Promise<any>
  chainWebpack?: (webpackConfig: any, args: any) => Promise<any>
  bundleImplementor?: typeof defaultWebpack
  babelOptsForDep?: Record<string, unknown>
  miniCSSExtractPluginLoaderPath?: string
  babelOpts?: Record<string, unknown>
  miniCSSExtractPluginPath?: string
  env: 'development' | 'production'
  __disableTerserForTest?: boolean
  entry?: {
    [key: string]: string
  }
  htmlContent: string
  browserslist?: any
  hot?: boolean
  port?: number
  targets?: any
  cwd: string
  config: any
  type: any
}

export default async function getConfig(opts: IGetConfigOpts) {
  const {
    env,
    config,
    cwd,
    hot = true,
    type,
    port,
    htmlContent,
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
  const isReact = config.type === 'react'
  const isVue = config.type === 'vue'

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
    .extensions.merge([
      '.web.js',
      '.wasm',
      '.mjs',
      '.js',
      '.web.jsx',
      '.jsx',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.json'
    ])

  const babelOpts = getBabelOpts({
    config,
    presetOpts: {
      typescript: !isVue,
      nodeEnv: env,
      dynamicImportNode: !config.dynamicImport,
      autoCSSModules: true,
      env: {
        targets
      },
      type: config.type,
      frameOptions: config.frameOptions
    },
    hot
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

  webpackConfig.when(isVue, (WConfig) => {
    WConfig.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        hotReload: hot
      })

    // http://link.vuejs.org/feature-flags
    WConfig.plugin('feature-flags').use(defaultWebpack.DefinePlugin, [
      {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false'
      }
    ])

    WConfig.module
      .rule('vue-ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        transpileOnly: true,
        appendTsSuffixTo: ['\\.vue$']
        // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
        // happyPackMode: useThreads
      })

    WConfig.plugin('vue-client').use(VueClient)

    WConfig.plugin('vue-loader').use(require('vue-loader').VueLoaderPlugin)
  })

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
  webpackConfig.when(isReact && isDev && !!hot, (WConfig) => {
    WConfig.plugin('hmr').use(ReactRefreshWebpackPlugin)
  })

  webpackConfig.when(!isDev, (WConfig) => {
    WConfig.plugin('extract-css').use(miniCssExtractPlugin)
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

  webpackConfig
    .plugin('HtmlWebpackPlugin')
    .use(HtmlWebpackPlugin, [{ templateContent: htmlContent }])

  webpackConfig.when(config.externals, (WConfig) => {
    WConfig.externals(config.externals)
  })

  webpackConfig.when(config.alias, (WConfig) => {
    Object.keys(config.alias).forEach((key) => {
      WConfig.resolve.alias.set(key, config.alias![key])
    })
  })

  webpackConfig.plugin('ForkTsChecker').use(ForkTsCheckerWebpackPlugin, [
    {
      async: false,
      typescript: isVue
        ? {
            extensions: {
              vue: {
                enabled: true,
                compiler: '@vue/compiler-sfc'
              }
            },
            diagnosticOptions: {
              semantic: true
              // https://github.com/TypeStrong/ts-loader#happypackmode
              // syntactic: useThreads
            }
          }
        : {}
    }
  ])

  webpackConfig.plugin('ProgressBarPlugin').use(ProgressBarPlugin, [
    {
      total: 15,
      summary: false,
      complete: '▇',
      format: `🚧  ${chalk.cyan(':bar ')}${chalk.cyan(
        ':percent'
      )}  ${chalk.grey('( :elapseds )')}`,
      customSummary: (time) => {
        console.log(chalk.blue(`🎯 Successfully! Compiled time ${time} \n`))
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
    compress: isDev,
    noInfo: true,
    inline: true,
    stats: 'none',
    contentBase: '/'
  }

  return WTarget
}
