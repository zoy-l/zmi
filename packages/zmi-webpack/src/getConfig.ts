import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import miniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackDevServer from 'webpack-dev-server'
import { chalk, deepmerge } from '@zmi-cli/utils'
import { IPrivate } from '@zmi-cli/types'
import WebpackChain from 'webpack-chain'
import defaultWebpack from 'webpack'
import path from 'path'
import fs from 'fs'

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

const resolveModules = [
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
]

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
  const { targets, browserslist } = getTargetsAndBrowsersList(config)
  const { isReact, isVue } = getFrameType(config, pkg)
  const disableCompress = process.env.COMPRESS === 'none'
  const sourceMap = config.devtool !== 'none'
  const isDev = env === 'development'
  const isProd = env === 'production'

  const useHash = config.hash && isProd ? '[name].[contenthash:8]' : '[name]'
  const appOutputPath = path.join(cwd, config.outputPath ?? 'dist')

  const webpackConfig = new WebpackChain()
  const createCSSRule = ruleCss({
    webpackConfig,
    browserslist,
    sourceMap,
    config,
    isDev
  })

  let presetOpts = {
    dynamicImportNode: config.dynamicImport,
    autoCSSModules: config.autoCSSModules,
    type: config.frameType,
    typescript: !isVue,
    env: { targets },
    nodeEnv: env,
    sourceMap,
    isDev,
    isProd
  }

  modifyBabelPresetOpts && (presetOpts = await modifyBabelPresetOpts(presetOpts))
  let babelOpts = getBabelOpts({ config, presetOpts, hot })
  modifyBabelOpts && (babelOpts = await modifyBabelOpts(babelOpts))

  // @ts-expect-error: library type error
  webpackConfig.devtool(config.devtool)
  webpackConfig.mode(env)

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
  webpackConfig.resolve.modules.add('node_modules').end().extensions.merge(resolveModules)

  webpackConfig.module
    .rule('js')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include.add(cwd)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelOpts)

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

  webpackConfig.when(isVue, (WConfig) => {
    applyVue({ webpackConfig: WConfig, hot })
  })

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
        .use(require.resolve('css-minimizer-webpack-plugin'), [{ sourceMap }])
    }
  )

  webpackConfig.plugin('define').use(defaultWebpack.DefinePlugin, [config.define])

  // Turn on react fast refresh
  // Official implementation
  // And also added in cra 4.0
  // https://github.com/pmmmwh/react-refresh-webpack-plugin
  webpackConfig.when(isReact && isDev && hot, (WConfig) => {
    WConfig.plugin('hmr').use(ReactRefreshWebpackPlugin)
  })

  webpackConfig.when(!isDev, (WConfig) => {
    WConfig.plugin('extract-css').use(miniCssExtractPlugin, [
      { filename: `${useHash}.css`, chunkFilename: `${[useHash]}.chunk.css` }
    ])
  })

  // IgnorePlugin ignores localized content when packaging
  // https://www.webpackjs.com/plugins/ignore-plugin/
  webpackConfig.when(config.ignoreMomentLocale, (WConfig) => {
    WConfig.plugin('ignore-moment-locale').use(bundleImplementor.IgnorePlugin, [
      { resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }
    ])
  })

  webpackConfig
    .plugin('HtmlWebpackPlugin')
    .use(HtmlWebpackPlugin, [{ templateContent: htmlContent }])

  webpackConfig.externals(config.externals)

  Object.keys(config.alias).forEach((key) => {
    webpackConfig.resolve.alias.set(key, config.alias[key])
  })

  const forkTsCheckerOpt: Record<string, any> = {
    async: false,
    typescript: {
      extensions: {
        vue: {
          enabled: true,
          compiler: '@vue/compiler-sfc'
        }
      },
      diagnosticOptions: {
        semantic: true
      }
    }
  }

  if (isReact) {
    delete forkTsCheckerOpt.typescript
  }

  webpackConfig.when(fs.existsSync(`${cwd}/tsconfig.json`), (WConfig) => {
    WConfig.plugin('ForkTsChecker').use(ForkTsCheckerWebpackPlugin, [forkTsCheckerOpt])
  })

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

  const devServer = deepmerge.all([
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

  Object.keys(devServer).forEach((key) => {
    webpackConfig.devServer.set(key, devServer[key])
  })

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

  return webpackConfig.toConfig()
}

function getFrameType(config: IPrivate, pkg: Record<string, any>) {
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

  return {
    isReact,
    isVue
  }
}

function applyVue({ webpackConfig, hot }: { webpackConfig: WebpackChain; hot: boolean }) {
  webpackConfig.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))
    .options({
      hotReload: hot
    })

  webpackConfig.module
    .rule('vue-ts')
    .test(/\.ts$/)
    .use('ts-loader')
    .loader(require.resolve('ts-loader'))
    .options({
      transpileOnly: true,
      appendTsSuffixTo: ['\\.vue$']
    })

  webpackConfig.plugin('vue-client').use(VueClientWebpackPlugin)

  webpackConfig.plugin('vue-loader').use(require('vue-loader').VueLoaderPlugin)

  webpackConfig.plugin('define').use(defaultWebpack.DefinePlugin, [
    {
      // http://link.vuejs.org/feature-flags
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false'
    }
  ])
}
