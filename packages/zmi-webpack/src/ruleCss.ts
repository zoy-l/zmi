import miniCssExtractPlugin from 'mini-css-extract-plugin'
import { deepmerge } from '@zmi/utils'
import Config from 'webpack-chain'

interface IOpts {
  webpackConfig: Config
  config: any
  isDev: boolean
  disableCompress?: boolean
  browserslist?: Record<string, any>
  sourceMap: boolean
}

interface ICreateCSSRuleOpts {
  lang: string
  test: RegExp
  loader?: string
  options?: Record<string, any>
}

export default (options: IOpts) => {
  const { webpackConfig, isDev, config, browserslist, sourceMap } = options

  function createCSSRule(createCSSRuleOptions: ICreateCSSRuleOpts) {
    const { lang, test, loader } = createCSSRuleOptions
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
            .options(deepmerge({ base: 0 }, config.styleLoader ?? {}))
        },
        (WConfig) => {
          WConfig.use('extract-css-loader')
            .loader(miniCssExtractPlugin.loader)
            .options({ publicPath: './', esModule: !isDev })
        }
      )

      rule.when(isDev && isCSSModules && config.cssModulesTypescript, (WConfig) => {
        WConfig.use('css-modules-typescript-loader')
          .loader(require.resolve('css-modules-typescript-loader'))
          .options(config.cssModulesTypescript)
      })

      // prettier-ignore
      const cssLoaderOptions: Record<string, any> = deepmerge({
          importLoaders: 1,
          modules: {},
          sourceMap
        },config.cssLoader ?? {})

      if (isCSSModules) {
        cssLoaderOptions.modules = {
          localIdentName: '[local]___[hash:base64:5]',
          ...cssLoaderOptions.modules
        }
      } else {
        delete cssLoaderOptions.modules
      }

      // prettier-ignore
      rule.use('css-loader')
        .loader(require.resolve('css-loader'))
        .options(cssLoaderOptions)

      // prettier-ignore
      rule.use('postcss')
        .loader(require.resolve('postcss-loader'))
        .options({
          postcssOptions: {
            sourceMap,
            plugins: [
              require.resolve('postcss-flexbugs-fixes'),
              [
                require.resolve('postcss-preset-env'),{
                  autoprefixer: {
                    ...(config.autoprefixer ?? {}),
                    overrideBrowserslist: browserslist ?? {}
                  },stage: 3}
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

  const { less, scss, stylus } = config.loaderOptions

  createCSSRule({ lang: 'css', test: /\.(css)(\?.*)?$/ })

  createCSSRule({
    lang: 'scss',
    test: /\.scss$/,
    loader: 'sass-loader',
    options: deepmerge({ sourceMap }, scss)
  })

  createCSSRule({
    lang: 'less',
    test: /\.less$/,
    loader: require.resolve('less-loader'),
    options: deepmerge({ sourceMap }, less)
  })

  createCSSRule({
    lang: 'stylus',
    test: /\.styl(us)?$/,
    loader: 'stylus-loader',
    options: deepmerge({ sourceMap }, stylus)
  })

  return createCSSRule
}
