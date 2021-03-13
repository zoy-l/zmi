import miniCssExtractPlugin from 'mini-css-extract-plugin'
import { deepmerge } from '@zmi-cli/utils'
import Config from 'webpack-chain'

import type { IPenetrateOptions } from './types'

export interface ICreateCSSRuleOpts {
  lang: string
  test: RegExp
  loader?: string
  options?: Record<string, any>
}

export default (options: IPenetrateOptions) => {
  const { webpackConfig, isDev, config, browserslist, sourceMap } = options
  const { lessLoader, scssLoader, stylusLoader, styleLoader, cssLoader } = config.loaderOptions

  function createCSSRule(createCSSRuleOptions: ICreateCSSRuleOpts) {
    const { lang, test, loader, options = {} } = createCSSRuleOptions
    const baseRule = webpackConfig.module.rule(lang).test(test)

    const modulesRule = baseRule.oneOf('normal-modules').resourceQuery(/module/)
    applyLoaders(modulesRule, true)

    const normalRule = baseRule.oneOf('normal')
    applyLoaders(normalRule, false)

    function applyLoaders(rule: Config.Rule<Config.Rule>, isCSSModules: boolean) {
      rule.when(
        isDev,
        (WConfig) => {
          WConfig.use('style-loader')
            .loader(require.resolve('style-loader'))
            .options(deepmerge({ base: 0 }, styleLoader))
        },
        (WConfig) => {
          WConfig.use('extract-css-loader')
            .loader(miniCssExtractPlugin.loader)
            .options({ publicPath: './', esModule: !isDev })
        }
      )

      rule.when(isDev && isCSSModules && !!config.cssModulesTypescript, (WConfig) => {
        WConfig.use('css-modules-typescript-loader')
          .loader(require.resolve('css-modules-typescript-loader'))
          .options({ mode: config.cssModulesTypescript })
      })

      const cssLoaderOptions: Record<string, any> = deepmerge(
        {
          importLoaders: 1,
          modules: {
            exportLocalsConvention: 'camelCaseOnly'
          },
          sourceMap
        },
        cssLoader
      )

      if (isCSSModules) {
        cssLoaderOptions.modules = {
          localIdentName: '[local]___[hash:base64:5]',
          ...cssLoaderOptions.modules
        }
      } else {
        delete cssLoaderOptions.modules
      }

      rule.use('css-loader').loader(require.resolve('css-loader')).options(cssLoaderOptions)

      rule
        .use('postcss')
        .loader(require.resolve('postcss-loader'))
        .options({
          postcssOptions: {
            sourceMap,
            plugins: [
              require.resolve('postcss-flexbugs-fixes'),
              [
                require.resolve('postcss-preset-env'),
                {
                  autoprefixer: {
                    ...config.autoprefixer,
                    overrideBrowserslist: browserslist ?? {}
                  },
                  stage: 3
                }
              ],
              ...config.extraPostCSSPlugins
            ].filter(Boolean)
          }
        })

      if (loader) {
        let resolvedLoader
        try {
          resolvedLoader = require.resolve(loader)
        } catch {
          resolvedLoader = loader
        }

        rule.use(loader).loader(resolvedLoader).options(deepmerge({ sourceMap }, options))
      }
    }
  }

  createCSSRule({ lang: 'css', test: /\.(css)(\?.*)?$/ })

  createCSSRule({
    lang: 'scss',
    test: /\.scss$/,
    loader: 'sass-loader',
    options: scssLoader
  })

  createCSSRule({
    lang: 'less',
    test: /\.less$/,
    loader: 'less-loader',
    options: lessLoader
  })

  createCSSRule({
    lang: 'stylus',
    test: /\.styl(us)?$/,
    loader: 'stylus-loader',
    options: stylusLoader
  })

  return createCSSRule
}
