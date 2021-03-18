import type { IPenetrateOptions } from './types'
import getBabelOpts from './getBabelOptions'

async function applyLoader(options: IPenetrateOptions) {
  const {
    modifyBabelPresetOpts,
    modifyBabelOpts,
    webpackConfig,
    isTypescript,
    sourceMap,
    targets,
    isProd,
    config,
    isVue,
    isDev,
    hot,
    cwd,
    env
  } = options

  const genAssetSubPath = (dir: string) => `${dir}/[name].[hash:8].[ext]`

  const genUrlLoaderOptions = (dir: string) => ({
    limit: 4096,
    esModule: false,
    fallback: {
      loader: require.resolve('file-loader'),
      options: {
        name: genAssetSubPath(dir),
        esModule: false
      }
    }
  })

  let presetOpts = {
    dynamicImportNode: config.dynamicImport,
    autoCSSModules: config.autoCSSModules,
    typescript: !isVue && isTypescript,
    type: config.frameType,
    env: { targets },
    nodeEnv: env,
    sourceMap,
    isProd,
    isDev
  }

  modifyBabelPresetOpts && (presetOpts = await modifyBabelPresetOpts(presetOpts))
  let babelOpts = getBabelOpts({ config, presetOpts, hot })
  modifyBabelOpts && (babelOpts = await modifyBabelOpts(babelOpts))

  webpackConfig.when(isVue, (WConifg) => {
    WConifg.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader(require.resolve('vue-loader'))
      .options({ hotReload: hot, prettify: false })
  })

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
    .options(genUrlLoaderOptions('img'))

  // https://github.com/facebookincubator/create-react-app/pull/1180
  webpackConfig.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({
      name: genAssetSubPath('img'),
      esModule: false
    })

  webpackConfig.module
    .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options(genUrlLoaderOptions('fonts'))

  webpackConfig.module
    .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options(genUrlLoaderOptions('media'))

  webpackConfig.module
    .rule('plaintext')
    .test(/\.(txt|text|md)$/)
    .use('raw-loader')
    .loader(require.resolve('raw-loader'))
}

export default applyLoader
