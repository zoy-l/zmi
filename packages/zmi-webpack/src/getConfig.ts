import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import miniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackDevServer from 'webpack-dev-server'
import { chalk, deepmerge } from '@zmi/utils'
import WebpackChain from 'webpack-chain'
import defaultWebpack from 'webpack'
import { IPrivate } from '@zmi/types'
import path from 'path'

import getTargetsAndBrowsersList from './getTargetsAndBrowsersList'
import VueClientWebpackPlugin from './VueClientWebpackPlugin'
import { getBabelOpts } from './getBabelOptions'
import terserOptions from './terserOptions'
import ruleCss from './ruleCss'

export interface IGetConfigOpts {
  chainWebpack?: (webpackConfig: WebpackChain, args: Record<string, any>) => Promise<any>
  modifyBabelPresetOpts?: <T>(opts: T) => Promise<T> | T
  modifyBabelOpts?: <T>(opts: T) => Promise<T> | T
  bundleImplementor?: typeof defaultWebpack
  env: 'development' | 'production'
  entry: Record<string, any>
  pkg: Record<string, any>
  htmlContent: string
  config: IPrivate
  hot?: boolean
  port?: number
  cwd: string
}

export default async function getConfig(opts: IGetConfigOpts) {
  const {
    bundleImplementor = defaultWebpack,
    modifyBabelPresetOpts,
    modifyBabelOpts,
    htmlContent,
    hot = true,
    config,
    entry,
    port,
    env,
    pkg,
    cwd
  } = opts
  const { targets, browserslist } = getTargetsAndBrowsersList({
    config
  })

  const disableCompress = process.env.COMPRESS === 'none'
  const sourceMap = config.devtool !== 'none'
  const isDev = env === 'development'
  const isProd = env === 'production'
  let isReact = false
  let isVue = false

  if (config.frameType) {
    isReact = config.frameType === 'react'
    isVue = config.frameType === 'vue'
  } else {
    const dpsArr = Object.keys(pkg.dependencies)

    for (const dpsName of dpsArr) {
      if (dpsName === 'vue') {
        isVue = true
        config.frameType = 'vue'
        continue
      }

      if (dpsName === 'react') {
        config.frameType = 'react'
        isReact = true
      }
    }

    if (isVue && isReact) {
      throw new Error(
        'When react/vue is found in dependencies, please specify type in .zmirc:`vue` | `react`'
      )
    }

    if (!isVue && !isReact) {
      throw new Error(
        'React/vue is not found in dependencies, did you forget to install dependencies ?'
      )
    }
  }

  const webpackConfig = new WebpackChain()
  const createCSSRule = ruleCss({
    webpackConfig,
    browserslist,
    sourceMap,
    config,
    isDev
  })

  // @ts-expect-error: library type error
  webpackConfig.devtool(config.devtool)
  webpackConfig.mode(env)

  const appOutputPath = path.join(cwd, config.outputPath ?? 'dist')
  const useHash = config.hash && isProd ? '[name].[contenthash:8]' : '[name]'

  webpackConfig.when(!!entry, (WConfig) => {
    Object.keys(entry).forEach((key) => {
      const entryPoint = WConfig.entry(key)

      entryPoint.add(entry[key])
    })
  })

  webpackConfig.output
    .path(appOutputPath)
    .filename(`${useHash}.js`)
    .chunkFilename(`${useHash}.js`)
    .publicPath(config.publicPath)

  // To be verified .set('symlinks', true)
  webpackConfig.resolve.modules
    .add('node_modules')
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

  let presetOpts = {
    typescript: !isVue,
    isDev,
    isProd,
    nodeEnv: env,
    dynamicImportNode: config.dynamicImport,
    autoCSSModules: config.autoCSSModules,
    env: {
      targets
    },
    type: config.frameType
  }

  if (modifyBabelPresetOpts) {
    presetOpts = await modifyBabelPresetOpts(presetOpts)
  }

  let babelOpts = getBabelOpts({
    config,
    presetOpts,
    hot
  })

  if (modifyBabelOpts) {
    babelOpts = await modifyBabelOpts(babelOpts)
  }

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

  webpackConfig.when(!!isVue, (WConfig) => {
    WConfig.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        hotReload: hot
      })

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

    WConfig.plugin('vue-client').use(VueClientWebpackPlugin)

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

  webpackConfig.when(
    disableCompress,
    (WConfig) => {
      WConfig.optimization.minimize(false)
    },
    (WConfig) => {
      WConfig.optimization
        .minimizer('terser')
        .use(require.resolve('terser-webpack-plugin'), [
          {
            terserOptions: deepmerge(terserOptions, config.terserOptions),
            extractComments: false,
            parallel: true
          }
        ])

      WConfig.optimization
        .minimizer('css-minimizer')
        .use(require.resolve('css-minimizer-webpack-plugin'), [
          {
            sourceMap
          }
        ])
    }
  )

  webpackConfig.plugin('define').use(defaultWebpack.DefinePlugin, [
    {
      ...config.define,
      // http://link.vuejs.org/feature-flags
      ...(isVue
        ? {
            __VUE_OPTIONS_API__: 'true',
            __VUE_PROD_DEVTOOLS__: 'false'
          }
        : {})
    }
  ])

  // Turn on react fast refresh
  // Official implementation
  // And also added in cra 4.0
  // https://github.com/pmmmwh/react-refresh-webpack-plugin
  webpackConfig.when(!!isReact && isDev && !!hot, (WConfig) => {
    WConfig.plugin('hmr').use(ReactRefreshWebpackPlugin)
  })

  webpackConfig.when(!isDev, (WConfig) => {
    WConfig.plugin('extract-css').use(miniCssExtractPlugin, [
      { filename: `${useHash}.css`, chunkFilename: `${[useHash]}.chunk.css` }
    ])
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

  if (config.externals) {
    webpackConfig.externals(config.externals)
  }

  if (config.alias) {
    Object.keys(config.alias).forEach((key) => {
      webpackConfig.resolve.alias.set(key, config.alias![key])
    })
  }

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
      format: `🚧  ${chalk.cyan(':bar ')}${chalk.cyan(':percent')}  ${chalk.grey(
        '( :elapseds )'
      )}`,
      customSummary: (time) => {
        console.log(chalk.blue(`🎯 time ${time} \n`))
      }
    }
  ])

  if (opts.chainWebpack) {
    await opts.chainWebpack(webpackConfig, {
      webpack: bundleImplementor,
      createCSSRule
    })
  }

  if (config.chainWebpack) {
    await config.chainWebpack(webpackConfig, {
      webpack: bundleImplementor,
      createCSSRule,
      env
    })
  }

  const WTarget = webpackConfig.toConfig()

  WTarget.devServer = deepmerge.all([
    {
      hot,
      port,
      clientLogLevel: 'silent',
      compress: isProd,
      noInfo: true,
      inline: true,
      stats: 'none',
      contentBase: '/'
    },
    config.devServer,
    {
      before(app, server, compiler) {
        // apply in project middlewares
        config.devServer.before?.(app, server, compiler)
      },
      open: false
    } as WebpackDevServer.Configuration
  ])

  return WTarget
}
