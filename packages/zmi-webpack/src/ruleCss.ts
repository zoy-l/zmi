import miniCssExtractPlugin from 'mini-css-extract-plugin'
import { deepmerge } from '@zmi/utils'
import Config from 'webpack-chain'

interface IOpts {
  type: any
  webpackConfig: Config
  config: any
  isDev: boolean
  disableCompress?: boolean
  browserslist?: any
  miniCSSExtractPluginPath?: string
  miniCSSExtractPluginLoaderPath?: string
}

interface ICreateCSSRuleOpts {
  lang: string
  test: RegExp
  loader?: string
  options?: Record<string, unknown>
}

type IApplyLoadersOpts = {
  rule: Config.Rule<Config.Rule>
  isCSSModules: boolean
} & Omit<ICreateCSSRuleOpts, 'test' | 'lang'>

export default class RuleCss {
  options: IOpts

  constructor(options: IOpts) {
    this.options = options
  }

  createCSSRule(createCSSRuleOptions: ICreateCSSRuleOpts) {
    const { lang, test, loader, options } = createCSSRuleOptions
    const { webpackConfig } = this.options
    const rule = webpackConfig.module.rule(lang).test(test)

    this.applyLoaders({
      rule: rule.oneOf('css-modules').resourceQuery(/modules/),
      isCSSModules: true,
      loader,
      options
    })
    this.applyLoaders({
      rule: rule.oneOf('css'),
      isCSSModules: false,
      loader,
      options
    })
  }

  applyLoaders(applyLoadersOptions: IApplyLoadersOpts) {
    const { rule, isCSSModules, loader, options } = applyLoadersOptions
    const { config, isDev } = this.options

    rule.when(
      isDev,
      (WConfig) => {
        WConfig.use('style-loader')
          .loader(require.resolve('style-loader'))
          .options(
            deepmerge(
              {
                base: 0
              },
              config.styleLoader ?? {}
            )
          )
      },
      (WConfig) => {
        WConfig.use('extract-css-loader')
          .loader(miniCssExtractPlugin.loader)
          .options({
            publicPath: './'
          })
      }
    )

    // prettier-ignore
    rule.when(isDev && isCSSModules && config.cssModulesTypescript, (WConfig) => {
      WConfig.use('css-modules-typescript-loader')
        .loader(require.resolve('css-modules-typescript-loader'))
        .options(config.cssModulesTypescript)
    })

    // prettier-ignore
    rule.use('css-loader')
      .loader(require.resolve('css-loader'))
      .options(
        deepmerge(
          { importLoaders: 1,
            ...(isCSSModules
              ? {modules: {
                  localIdentName: '[local]___[hash:base64:5]'
                }}
              : {})
          },
          config.cssLoader ?? {}
        )
      )

    rule.when(!!loader, (WConfig) => {
      WConfig.use(loader!)
        .loader(loader!)
        .options(options ?? {})
    })
  }

  step() {
    this.createCSSRule({
      lang: 'css',
      test: /\.(css)(\?.*)?$/
    })
  }
}
