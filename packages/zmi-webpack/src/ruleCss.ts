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

    // prettier-ignore
    rule.when(config.styleLoader,
    (WConfig) => {
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
    this.createCSSRule({
      lang: 'css',
      test: /\.(css)(\?.*)?$/
    })
  }
}
