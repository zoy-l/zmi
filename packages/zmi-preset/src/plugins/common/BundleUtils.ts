import { IApi } from '@zmi-cli/types'
import DefaultBundler from '@zmi-cli/webpack'
import path from 'path'
import fs from 'fs'

import { getHtmlGenerator } from './generateHtml'

export async function getBundleAndConfigs(options: { api: IApi; port?: number }) {
  const { api, port } = options

  const Html = getHtmlGenerator({ api })

  const htmlContent = await Html.getContent()

  // Apply webpack launcher to get an instance
  // Also used to switch between different build tools
  // Built-in device by default
  const Bundler = await api.applyPlugins({
    type: api.ApplyPluginsType.modify,
    key: 'modifyBundler',
    initialValue: DefaultBundler
  })

  // Used to get webpack instance
  // No changes are made here, but developers may change
  // Use built-in webpack by default
  const bundleImplementor = await api.applyPlugins({
    key: 'modifyBundleImplementor',
    type: api.ApplyPluginsType.modify,
    initialValue: undefined
  })

  // Initialize the webpack launcher
  const bundler: DefaultBundler = new Bundler({
    cwd: api.cwd,
    config: api.config,
    pkg: api.pkg
  })

  const bundlerArgs = {
    env: api.env,
    bundler: { id: Bundler.id, version: Bundler.version }
  }

  const getArgs = (otps: Record<string, any>) => ({
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
        hot: process.env.HMR !== 'none',
        bundleImplementor,
        htmlContent,
        async modifyBabelOpts(opts: any) {
          return api.applyPlugins({
            type: api.ApplyPluginsType.modify,
            key: 'modifyBabelOpts',
            initialValue: opts
          })
        },
        async modifyBabelPresetOpts(opts: any) {
          return api.applyPlugins({
            type: api.ApplyPluginsType.modify,
            key: 'modifyBabelPresetOpts',
            initialValue: opts
          })
        },
        async chainWebpack(webpackConfig: any, opts: any) {
          return api.applyPlugins({
            type: api.ApplyPluginsType.modify,
            key: 'chainWebpack',
            initialValue: webpackConfig,
            args: {
              ...opts
            }
          })
        }
      },
      args: getArgs({})
    })

    return api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundleConfig',
      initialValue: await bundler.getConfig(getConfigOpts),
      args: getArgs({})
    })
  }

  const bundleConfigs = await api.applyPlugins({
    type: api.ApplyPluginsType.modify,
    key: 'modifyBundleConfigs',
    initialValue: await getConfig(),
    args: getArgs({ getConfig })
  })

  return {
    bundleImplementor,
    bundleConfigs,
    bundler
  }
}
