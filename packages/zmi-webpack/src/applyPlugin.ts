import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { chalk, deepmerge, fsExtra, isWin } from '@zmi-cli/utils'
import webpackBundleAnalyzer from 'webpack-bundle-analyzer'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import miniCssExtractPlugin from 'mini-css-extract-plugin'
import esLintWebpackPlugin from 'eslint-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'
import eslint from 'eslint'
import path from 'path'

import VueClientWebpackPlugin from './VueClientWebpackPlugin'
import type { IPenetrateOptions } from './types'
import terserOptions from './terserOptions'
import PrettierHtml from './PrettierHtml'
import formatter from './eslintFormatter'

const ESLINT_CONFIG = ['.eslintrc', '.eslintrc.json', '.eslintrc.js']

async function applyPlugin(options: IPenetrateOptions) {
  const {
    webpackConfig,
    isTypescript,
    htmlContent,
    sourceMap,
    isReact,
    useHash,
    isProd,
    config,
    isVue,
    isDev,
    hot,
    pkg,
    cwd
  } = options

  const disableCompress = isProd && process.env.COMPRESS !== 'none'

  webpackConfig.when(process.env.ZMI_TEST !== 'true', (WConfig) => {
    WConfig.plugin('ProgressBarPlugin').use(ProgressBarPlugin, [
      {
        total: 15,
        summary: false,
        complete: '▇',
        format: `${isWin ? '⭐' : '🚧'}  ${chalk.cyan(':bar ')}${chalk.cyan(
          ':percent'
        )}  ${chalk.grey('( :elapseds )')}`,
        customSummary: (time) => {
          console.log(chalk.blue(`${isWin ? '✨' : '🎯'} time ${time} \n`))
        }
      }
    ])
  })

  let isEslint = false
  let eslintConfig: eslint.Linter.Config = {}

  if (config.disableESLint) {
    const cli = new eslint.ESLint({ cwd })
    for (const file of ESLINT_CONFIG) {
      const es = path.join(cwd, file)
      if (fsExtra.existsSync(es)) {
        isEslint = true
        eslintConfig = await cli.calculateConfigForFile(file)
        break
      }
    }

    if (!isEslint) {
      const { eslintConfig: pkgEslintConfig } = pkg
      if (pkgEslintConfig) {
        isEslint = true
        eslintConfig = pkgEslintConfig
      }
    }
  }

  webpackConfig.when(config.disableESLint && isEslint, (WConfig) => {
    WConfig.plugin('esLintWebpackPlugin').use(esLintWebpackPlugin, [
      {
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx', 'vue'],
        formatter,
        eslintPath: require.resolve('eslint'),
        context: cwd,
        cwd,
        cache: true,
        failOnError: isDev,
        resolvePluginsRelativeTo: __dirname,
        cacheLocation: path.join(cwd, 'node_modules/.cache/.eslintcache'),
        baseConfig: eslintConfig,
        overrideConfig: {
          rules: isTypescript
            ? {
                'no-unused-vars': 'off'
              }
            : {}
        }
      }
    ])
  })

  if (config.copy && isProd) {
    const copyPatterns = config.copy.map(
      (item: string | { to: string; from: string }) => {
        return typeof item === 'string'
          ? { from: path.join(cwd, item) }
          : {
              from: path.join(cwd, item.from),
              to: path.join(cwd, item.to)
            }
      }
    )

    webpackConfig
      .plugin('CopyWebpackPlugin')
      .use(CopyWebpackPlugin, [{ patterns: copyPatterns }])
  }

  webpackConfig.plugin('define').use(webpack.DefinePlugin, [config.define])

  const forkTsCheckerOpt: Record<string, any> = {
    async: false,
    typescript: {
      extensions: {
        vue: {
          enabled: true,
          compiler: '@vue/compiler-sfc'
        }
      },
      configFile: path.join(cwd, 'tsconfig.json'),
      diagnosticOptions: {
        semantic: true
      }
    }
  }

  if (isReact) {
    delete forkTsCheckerOpt.typescript.extensions.vue
  }

  webpackConfig.when(isTypescript, (WConfig) => {
    WConfig.plugin('ForkTsChecker').use(ForkTsCheckerWebpackPlugin, [forkTsCheckerOpt])
  })

  // Turn on react fast refresh
  // Official implementation
  // And also added in cra 4.0
  // https://github.com/pmmmwh/react-refresh-webpack-plugin
  webpackConfig.when(isReact && isDev && hot, (WConfig) => {
    WConfig.plugin('hmr').use(require.resolve('@pmmmwh/react-refresh-webpack-plugin'))
  })

  webpackConfig.when(
    disableCompress,
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
    },
    (WConfig) => {
      WConfig.optimization.minimize(false)
    }
  )

  webpackConfig.when(
    isProd,
    (WConfig) => {
      WConfig.plugin('extract-css').use(miniCssExtractPlugin, [
        { filename: `${useHash}.css`, chunkFilename: `${[useHash]}.chunk.css` }
      ])
    },
    (WConfig) => {
      WConfig.plugin('prettier-html').use(PrettierHtml)
    }
  )

  if (process.env.ANALYZER) {
    webpackConfig
      .plugin('webpackBundleAnalyzer')
      .use(webpackBundleAnalyzer.BundleAnalyzerPlugin)
  }

  webpackConfig.when(config.ignoreMomentLocale, (WConfig) => {
    WConfig.plugin('ignore-moment-locale').use(webpack.IgnorePlugin, [
      { resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }
    ])
  })

  const omitKey = ['favicon', 'template', 'templateContent']
  omitKey.forEach((key) => {
    if (config.htmlPlugin[key]) {
      delete config.htmlPlugin[key]
    }
  })

  webpackConfig
    .plugin('HtmlWebpackPlugin')
    .use(HtmlWebpackPlugin, [
      deepmerge(config.htmlPlugin, { templateContent: htmlContent })
    ])

  webpackConfig.when(isVue, (WConifg) => {
    if (isDev) {
      WConifg.plugin('vue-client').use(VueClientWebpackPlugin)
    }

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
