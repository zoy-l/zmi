import type { IPenetrateOptions } from './types'
import { getBabelOpts } from './getBabelOptions'

async function applyLoader(options: IPenetrateOptions) {
  const {
    configOptions,
    webpackConfig,
    isTypescript,
    sourceMap,
    targets,
    isProd,
    isVue,
    isDev
  } = options

  const { cwd, modifyBabelPresetOpts, modifyBabelOpts, config, hot, env } = configOptions

  let presetOpts = {
    dynamicImportNode: config.dynamicImport,
    autoCSSModules: config.autoCSSModules,
    type: config.frameType,
    typescript: !isVue,
    env: { targets },
    nodeEnv: env,
    sourceMap,
    isProd,
    isDev
  }

  modifyBabelPresetOpts && (presetOpts = await modifyBabelPresetOpts(presetOpts))
  let babelOpts = getBabelOpts({ config, presetOpts, hot })
  modifyBabelOpts && (babelOpts = await modifyBabelOpts(babelOpts))

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

  webpackConfig.when(isVue, (WConifg) => {
    WConifg.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader(require.resolve('vue-loader'))
      .options({ hotReload: hot })

    if (isTypescript) {
      WConifg.module
        .rule('vue-ts')
        .test(/\.ts$/)
        .use('ts-loader')
        .loader(require.resolve('ts-loader'))
        .options({
          transpileOnly: true,
          appendTsSuffixTo: ['\\.vue$']
        })
    }
  })
}

export default applyLoader
