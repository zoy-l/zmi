import miniCssExtractPlugin from 'mini-css-extract-plugin'
import { deepmerge } from '@zmi/utils'
import Config from 'webpack-chain'

interface IOpts {
  webpackConfig: Config
  config: any
  isDev: boolean
  disableCompress?: boolean
  browserslist?: Record<string, any>
}

interface ICreateCSSRuleOpts {
  lang: string
  test: RegExp
  loader?: string
  options?: Record<string, any>
}

export default (options: IOpts) => {
  const { webpackConfig, isDev, config, browserslist } = options

  function createCSSRule(createCSSRuleOptions: ICreateCSSRuleOpts) {
    const { lang, test, loader } = createCSSRuleOptions
    const baseRule = webpackConfig.module.rule(lang).test(test)

    // prettier-ignore
    const modulesRule = baseRule.oneOf('normal-modules').resourceQuery(/module/)
    applyLoaders(modulesRule, true)

    const normalRule = baseRule.oneOf('normal')
    applyLoaders(normalRule, false)

    // prettier-ignore
    function applyLoaders( rule: Config.Rule<Config.Rule>, isCSSModules: boolean ) {
      rule.when(
        isDev,
        (WConfig) => {
          WConfig.use('style-loader')
          .loader(require.resolve('style-loader'))
          .options(deepmerge({ base: 0 }, config.styleLoader ?? {}))
        },
        (WConfig) => {
          WConfig.use('extract-css-loader')
            .loader(miniCssExtractPlugin.loader)
            .options({ publicPath: './' ,esModule:!isDev })
        }
      )

      // prettier-ignore
      rule.when(isDev && isCSSModules && config.cssModulesTypescript, (WConfig) => {
        WConfig.use('css-modules-typescript-loader')
          .loader(require.resolve('css-modules-typescript-loader'))
          .options(config.cssModulesTypescript)
      })

      const cssLoaderOptions:Record<string, any> = deepmerge({
        importLoaders: 1,
        modules:{}
      }, config.cssLoader ?? {})

      if (isCSSModules) {
        cssLoaderOptions.modules = {
          localIdentName: '[local]___[hash:base64:5]',
          ...cssLoaderOptions.modules
        }
      }else {
        delete cssLoaderOptions.modules
      }

      // prettier-ignore
      rule.use('css-loader')
        .loader(require.resolve('css-loader'))
        .options(cssLoaderOptions)

      rule
        .use('postcss')
        .loader(require.resolve('postcss-loader'))
        .options({
          postcssOptions: {
            plugins: [
              require.resolve('postcss-flexbugs-fixes'),
              [
                require.resolve('postcss-preset-env'),
                {
                  autoprefixer: {
                    ...(config.autoprefixer ?? {}),
                    overrideBrowserslist: browserslist ?? {}
                  },
                  stage: 3
                }
              ],
              ...(config.extraPostCSSPlugins ?? [])
            ].filter(Boolean)
          }
        })

      rule.when(!!loader, (WConfig) => {
        WConfig.use(loader!)
          .loader(loader!)
          .options(createCSSRuleOptions.options ?? {})
      })
    }
  }

  createCSSRule({ lang: 'css', test: /\.(css)(\?.*)?$/ })

  return createCSSRule
}
