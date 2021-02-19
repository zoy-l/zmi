import WebpackDevServer from 'webpack-dev-server'
import { deepmerge } from '@zmi-cli/utils'
import WebpackChain from 'webpack-chain'
import path from 'path'
import fs from 'fs'

import getTargetsAndBrowsersList from './getTargetsAndBrowsersList'
import { IConfigOpts, IPrivate } from './types'
import applyPlugin from './applyPlugin'
import applyLoader from './applyLoader'
import ruleCss from './ruleCss'

const resolveModules = [
  '.web.js',
  '.wasm',
  '.mjs',
  '.js',
  '.web.jsx',
  '.jsx',
  '.web.ts',
  '.ts',
  '.web.tsx',
  '.tsx',
  '.json'
]

export default async function getConfig(opts: IConfigOpts) {
  const { config, entry, port, env, pkg, cwd } = opts
  const { targets, browserslist } = getTargetsAndBrowsersList(config)
  const { isReact, isVue } = getFrameType(config, pkg)

  const sourceMap = config.devtool !== 'none'
  const isDev = env === 'development'
  const isProd = env === 'production'
  const hot = isDev && process.env.HMR !== 'none'

  const useHash = config.hash && isProd ? '[name].[contenthash:8]' : '[name]'
  const appOutputPath = path.join(cwd, config.outputPath)
  const isTypescript = fs.existsSync(`${cwd}/tsconfig.json`)
  const webpackConfig = new WebpackChain()

  const penetrateOptions = {
    webpackConfig,
    isTypescript,
    browserslist,
    sourceMap,
    targets,
    isReact,
    useHash,
    isProd,
    isDev,
    isVue,
    hot,
    ...opts
  }

  const createCSSRule = ruleCss(penetrateOptions)

  await applyLoader(penetrateOptions)

  applyPlugin(penetrateOptions)

  webpackConfig.devtool(config.devtool as WebpackChain.DevTool)
  webpackConfig.mode(env)

  webpackConfig.when(!!config.cache, (WConfig) => {
    const cacheOptions: Partial<{ [key: string]: any }> = {
      type: config.cache,
      buildDependencies: {
        config: [__filename]
      }
    }

    config.cache === 'memory' && delete cacheOptions.buildDependencies

    WConfig.cache(cacheOptions)
  })

  webpackConfig.when(!!entry, (WConfig) => {
    Object.keys(entry).forEach((key) => {
      const entryPoint = WConfig.entry(key)
      entryPoint.add(entry[key])
    })
  })

  webpackConfig.output
    .path(appOutputPath)
    .filename(`${useHash}.js`)
    .chunkFilename(`${useHash}.js`)
    .publicPath(config.publicPath)

  // To be verified .set('symlinks', true)
  webpackConfig.resolve.modules.add('node_modules').end().extensions.merge(resolveModules)

  webpackConfig.externals(config.externals)

  Object.keys(config.alias).forEach((key) => {
    webpackConfig.resolve.alias.set(key, config.alias[key])
  })

  const devServer = deepmerge.all([
    {
      hot,
      port,
      clientLogLevel: 'silent',
      compress: isProd,
      noInfo: true,
      stats: 'none',
      watchContentBase: isDev,
      publicPath: config.publicPath,
      contentBase: `${cwd}/public`
    },
    config.devServer,
    {
      before(app, server, compiler) {
        // apply in project middlewares
        config.devServer.before?.(app, server, compiler)
      },
      open: false
    } as WebpackDevServer.Configuration
  ])

  Object.keys(devServer).forEach((key) => {
    webpackConfig.devServer.set(key, devServer[key])
  })

  if (opts.chainWebpack) {
    await opts.chainWebpack(webpackConfig, {
      createCSSRule
    })
  }

  if (config.chainWebpack) {
    await config.chainWebpack(webpackConfig, {
      createCSSRule,
      env
    })
  }

  const ret = webpackConfig.toConfig()

  return ret
}

function getFrameType(config: IPrivate, pkg: Record<string, any>) {
  let isReact = false
  let isVue = false

  if (config.frameType) {
    isReact = config.frameType === 'react'
    isVue = config.frameType === 'vue'
  } else {
    const dpsArr = Object.keys(pkg.dependencies)

    for (const dpsName of dpsArr) {
      if (dpsName === 'vue') {
        isVue = true
        config.frameType = 'vue'
        continue
      }

      if (dpsName === 'react') {
        config.frameType = 'react'
        isReact = true
      }
    }

    if (isVue && isReact) {
      throw new Error(
        'When react/vue is found in dependencies, please specify type in .zmirc:`vue` | `react`'
      )
    }

    if (!isVue && !isReact) {
      throw new Error(
        'React/vue is not found in dependencies, did you forget to install dependencies ?'
      )
    }
  }

  return {
    isReact,
    isVue
  }
}
