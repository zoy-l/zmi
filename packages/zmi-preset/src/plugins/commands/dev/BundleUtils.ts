import { BundlerConfigType } from '@zmi/types'
import DefaultBundler from '@zmi/webpack'
import path from 'path'

import { getHtmlGenerator } from './generateHtml'

type Env = 'development' | 'production'

export async function getBundleAndConfigs(options: {
  api: any
  port?: number
}) {
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
    config: api.config
  })

  const bundlerArgs = {
    env: api.env,
    bundler: { id: Bundler.id, version: Bundler.version }
  }

  const getArgs = (otps: Record<string, any>) => ({
    ...otps,
    bundlerArgs
  })

  async function getConfig({ type }: { type: any }) {
    const env: Env = api.env === 'production' ? 'production' : 'development'
    const getConfigOpts = await api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundleConfigOpts',
      initialValue: {
        env,
        type,
        port,
        entry: {
          zmi: path.join(api.paths.appSrcPath!, 'zmi.tsx')
        },
        hot: type === BundlerConfigType.csr && process.env.HMR !== 'none',
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
      args: getArgs({ type })
    })

    return api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundleConfig',
      initialValue: await bundler.getConfig(getConfigOpts),
      args: getArgs({ type })
    })
  }

  const bundleConfigs = await api.applyPlugins({
    type: api.ApplyPluginsType.modify,
    key: 'modifyBundleConfigs',
    initialValue: await getConfig({ type: BundlerConfigType.csr }),
    args: getArgs({ getConfig })
  })

  return {
    bundleImplementor,
    bundleConfigs,
    bundler
  }
}
