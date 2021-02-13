import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import miniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { chalk, deepmerge } from '@zmi-cli/utils'
import WebpackChain from 'webpack-chain'
import webpack from 'webpack'
import fs from 'fs'

import VueClientWebpackPlugin from './VueClientWebpackPlugin'
import terserOptions from './terserOptions'
import { IConfigOpts } from './types'

function applyPlugin(options: {
  targets: Record<string, any>
  webpackConfig: WebpackChain
  configOptions: IConfigOpts
  sourceMap: boolean
  isVue: boolean
  isProd: boolean
  isDev: boolean
  isReact: boolean
  useHash: string
}) {
  const {
    webpackConfig,
    configOptions,
    sourceMap,
    isReact,
    useHash,
    isProd,
    isVue,
    isDev
  } = options
  const { cwd, hot, config, bundleImplementor = webpack, htmlContent } = configOptions

  const disableCompress = process.env.COMPRESS === 'none'

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

  webpackConfig.plugin('define').use(webpack.DefinePlugin, [config.define])

  webpackConfig.when(fs.existsSync(`${cwd}/tsconfig.json`), (WConfig) => {
    WConfig.plugin('ForkTsChecker').use(ForkTsCheckerWebpackPlugin, [forkTsCheckerOpt])
  })

  // Turn on react fast refresh
  // Official implementation
  // And also added in cra 4.0
  // https://github.com/pmmmwh/react-refresh-webpack-plugin
  webpackConfig.when(isReact && isDev && hot, (WConfig) => {
    WConfig.plugin('hmr').use(ReactRefreshWebpackPlugin)
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

  webpackConfig.when(isProd, (WConfig) => {
    WConfig.plugin('extract-css').use(miniCssExtractPlugin, [
      { filename: `${useHash}.css`, chunkFilename: `${[useHash]}.chunk.css` }
    ])
  })

  webpackConfig.when(config.ignoreMomentLocale, (WConfig) => {
    WConfig.plugin('ignore-moment-locale').use(bundleImplementor.IgnorePlugin, [
      { resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }
    ])
  })

  webpackConfig
    .plugin('HtmlWebpackPlugin')
    .use(HtmlWebpackPlugin, [{ templateContent: htmlContent }])

  webpackConfig.when(isVue, (WConifg) => {
    WConifg.plugin('vue-client').use(VueClientWebpackPlugin)

    WConifg.plugin('vue-loader').use(require('vue-loader').VueLoaderPlugin)

    WConifg.plugin('define').use(webpack.DefinePlugin, [
      {
        // http://link.vuejs.org/feature-flags
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false'
      }
    ])
  })
}

export default applyPlugin
