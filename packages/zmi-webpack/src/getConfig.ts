import WebpackDevServer from 'webpack-dev-server'
import { deepmerge } from '@zmi-cli/utils'
import WebpackChain from 'webpack-chain'
import { Configuration } from 'webpack'
import path from 'path'
import fs from 'fs'

import { IConfigOpts, IPrivate } from './types'
import applyPlugin from './applyPlugin'
import applyLoader from './applyLoader'
import getTargets from './getTargets'
import applyCss from './applyCss'

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

export default async function getConfig(opts: IConfigOpts): Promise<Configuration> {
  const { config, entry, port, env, pkg, cwd } = opts
  const { targets, browserslist } = getTargets(config)
  const { isReact, isVue } = getFrameType(config, pkg)

  const sourceMap = config.devtool !== false
  const isDev = env === 'development'
  const isProd = env === 'production'
  const hot = isDev && process.env.HMR !== 'none'

  const useHash = config.hash && isProd ? '[name].[contenthash:8]' : '[name]'
  const appOutputPath = path.join(cwd, config.outputPath)
  const isTypescript = fs.existsSync(path.join(cwd, 'tsconfig.json'))
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

  const createCSSRule = applyCss(penetrateOptions)

  await applyLoader(penetrateOptions)
  await applyPlugin(penetrateOptions)

  webpackConfig.devtool(
    (config.devtool ?? isDev
      ? 'eval-cheap-module-source-map'
      : false) as WebpackChain.DevTool
  )
  webpackConfig.mode(env)
  webpackConfig.stats('normal')

  webpackConfig.when(!!entry, (WConfig) => {
    Object.keys(entry).forEach((key) => {
      WConfig.entry(key).add(entry[key])
    })
  })

  webpackConfig.output
    .path(appOutputPath)
    .filename(`${useHash}.js`)
    .chunkFilename(`${useHash}.js`)
    .publicPath(config.publicPath)
    .pathinfo(isDev)
    .globalObject('this')

  // To be verified .set('symlinks', true)
  webpackConfig.resolve.modules.add('node_modules').end().extensions.merge(resolveModules)

  webpackConfig.performance.hints(false)

  webpackConfig.node.merge({
    global: false,
    __filename: false,
    __dirname: false
  })

  webpackConfig.externals(config.externals)

  Object.keys(config.alias).forEach((key) => {
    webpackConfig.resolve.alias.set(key, config.alias[key])
  })

  webpackConfig.when(isDev, (WConfig) => {
    WConfig.devServer.merge(
      deepmerge.all([
        {
          hot,
          port,
          clientLogLevel: 'silent',
          compress: isProd,
          noInfo: true,
          stats: 'none',
          publicPath: config.publicPath,
          watchOptions: {
            ignored: /.d.ts/
          }
          // watchContentBase: isDev,
          // contentBase: path.join(cwd, 'public')
        } as WebpackDevServer.Configuration,
        config.devServer,
        {
          before(app, server, compiler) {
            // apply in project middlewares
            config.devServer.before?.(app, server, compiler)
          },
          open: false
        } as WebpackDevServer.Configuration
      ])
    )
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

  if (config.cache) {
    const cacheOptions: {
      type: 'memory' | 'filesystem'
      buildDependencies?: Record<string, any>
    } = {
      type: config.cache,
      buildDependencies: {
        config: [__filename]
      }
    }
    config.cache === 'memory' && delete cacheOptions.buildDependencies
    ret.cache = cacheOptions
  }

  return ret
}

export function getFrameType(config: IPrivate, pkg: Record<string, any>) {
  let isReact = false
  let isVue = false

  if (config.frameType) {
    isReact = config.frameType === 'react'
    isVue = config.frameType === 'vue'
  } else {
    const dpsArr = Object.keys(pkg.dependencies ?? {})

    for (const dpsName of dpsArr) {
      if (dpsName === 'vue') {
        isVue = true
        config.frameType = 'vue'
        break
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
