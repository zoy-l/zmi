import { deepmerge } from '@zmi/utils'
import Config from 'webpack-chain'

interface IOpts {
  type: any
  webpackConfig: any
  config: any
  isDev: boolean
  disableCompress?: boolean
  browserslist?: any
  miniCSSExtractPluginPath?: string
  miniCSSExtractPluginLoaderPath?: string
}

interface ICreateCSSRuleOpts extends IOpts {
  lang: string
  test: RegExp
  loader?: string
  options?: Record<string, unknown>
}

export default class RuleCss {
  options: IOpts

  constructor(options: IOpts) {
    this.options = options
  }

  createCSSRule(options: ICreateCSSRuleOpts) {
    const { webpackConfig, lang, test } = options
    const rule = webpackConfig.module.rule(lang).test(test)

    this.applyLoaders({
      rule: rule.oneOf('css-modules').resourceQuery(/modules/),
      isCSSModules: true
    })
    this.applyLoaders({ rule: rule.oneOf('css'), isCSSModules: false })
  }

  applyLoaders(applyLoadersOptions: {
    rule: Config.Rule<Config.Rule>
    isCSSModules: boolean
    loader?: string
    options?: Record<string, unknown>
  }) {
    const { config, isDev } = this.options
    const { rule, isCSSModules, loader, options } = applyLoadersOptions
    // prettier-ignore
    rule.when(config.styleLoader, (WConfig) => {
      WConfig.use('style-loader')
        .loader(require.resolve('style-loader'))
        .options(
          deepmerge({
              base: 0
          }, config.styleLoader)
        )
    },(WConfig)=>{
      if (!config.styleLoader) {
        WConfig
          .use('extract-css-loader')
          // .loader(
          //   miniCSSExtractPluginLoaderPath ||
          //     require('../../mini-css-extract-plugin/dist/index').default
          //       .loader,
          // )
          // .options({
          //   publicPath: './',
          //   hmr: isDev,
          // });
      }
    })

    rule.when(
      isDev && isCSSModules && config.cssModulesTypescriptLoader,
      (WConfig) => {
        WConfig.use('css-modules-typescript-loader')
          .loader(require.resolve('css-modules-typescript-loader'))
          .options(config.cssModulesTypescriptLoader)
      }
    )

    rule.when(!!loader, (WConfig) => {
      WConfig.use(loader!)
        .loader(loader!)
        .options(options ?? {})
    })
  }

  step() {
    const {
      type,
      config,
      webpackConfig,
      isDev,
      // disableCompress,
      browserslist,
      // miniCSSExtractPluginPath,
      miniCSSExtractPluginLoaderPath
    } = this.options

    this.createCSSRule({
      type,
      webpackConfig,
      config,
      isDev,
      lang: 'css',
      test: /\.(css)(\?.*)?$/,
      browserslist,
      miniCSSExtractPluginLoaderPath
    })
  }
}
