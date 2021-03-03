import DefaultBundler, { WebpackChain, createCSSRule } from '@zmi-cli/webpack'
import { IApi } from '@zmi-cli/types'
import path from 'path'
import fs from 'fs'

import { getHtmlGenerator } from './generateHtml'

export async function getBundleAndConfigs(options: { api: IApi; port?: number }) {
  const { api, port } = options

  const Html = getHtmlGenerator(api)

  const htmlContent = await Html.getContent()

  // Apply webpack launcher to get an instance
  // Also used to switch between different build tools
  // Built-in device by default
  const Bundler = await api.applyPlugins({
    type: api.ApplyPluginsType.modify,
    initialValue: DefaultBundler,
    key: 'modifyBundler'
  })

  // Initialize the webpack launcher
  const bundler: DefaultBundler = new Bundler({
    config: api.config,
    cwd: api.cwd,
    pkg: api.pkg
  })

  const bundlerArgs = {
    env: api.env
  }

  const getArgs = (otps: Record<string, any> = {}) => ({
    args: {
      ...otps,
      bundlerArgs
    }
  })

  const entryFilePath =
    ['index.jsx', 'index.tsx', 'index.ts', 'index.js'].find((file) =>
      fs.existsSync(path.join(api.paths.appSrcPath, file))
    ) ?? 'index.js'

  async function getConfig() {
    const getConfigOpts = await api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundleConfigOpts',
      initialValue: {
        env: api.env ?? process.env.NODE_ENV,
        port,
        entry: {
          main: path.join(api.paths.appSrcPath, entryFilePath)
        },
        htmlContent,
        async modifyBabelOpts(initialValue: Record<string, any>) {
          return api.applyPlugins({
            type: api.ApplyPluginsType.modify,
            key: 'modifyBabelOpts',
            initialValue
          })
        },
        async modifyBabelPresetOpts(initialValue: Record<string, any>) {
          return api.applyPlugins({
            type: api.ApplyPluginsType.modify,
            key: 'modifyBabelPresetOpts',
            initialValue
          })
        },
        async chainWebpack(webpackConfig: WebpackChain, opts: { createCSSRule: createCSSRule }) {
          return api.applyPlugins({
            type: api.ApplyPluginsType.modify,
            key: 'chainWebpack',
            initialValue: webpackConfig,
            args: opts
          })
        }
      },
      args: getArgs()
    })

    return api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundleConfig',
      initialValue: await bundler.getConfig(getConfigOpts),
      args: getArgs()
    })
  }

  const bundleConfigs = await api.applyPlugins({
    type: api.ApplyPluginsType.modify,
    key: 'modifyBundleConfigs',
    initialValue: await getConfig(),
    args: getArgs({ getConfig })
  })

  return {
    bundleConfigs,
    bundler
  }
}
