import { BundlerConfigType } from '@zmi/types'
import DefaultBundler from '@zmi/webpack'

type Env = 'development' | 'production'

export async function getBundleAndConfigs(options: {
  api: any
  port?: number
}) {
  const { api, port } = options

  const Bundler = await api.applyPlugins({
    type: api.ApplyPluginsType.modify,
    key: 'modifyBundler',
    initialValue: DefaultBundler
  })

  const bundleImplementor = await api.applyPlugins({
    key: 'modifyBundleImplementor',
    type: api.ApplyPluginsType.modify,
    initialValue: undefined
  })

  const bundler: DefaultBundler = new Bundler({
    cwd: api.cwd,
    config: api.config
  })

  const bundlerArgs = {
    env: api.env,
    bundler: { id: Bundler.id, version: Bundler.version }
  }

  async function getConfig({ type }: { type: any }) {
    const env: Env = api.env === 'production' ? 'production' : 'development'
    const getConfigOpts = await api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundleConfigOpts',
      initialValue: {
        env,
        type,
        port,
        hot: type === BundlerConfigType.csr && process.env.HMR !== 'none',
        bundleImplementor,
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
      args: {
        ...bundlerArgs,
        type
      }
    })
    return api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundleConfig',
      initialValue: await bundler.getConfig(getConfigOpts),
      args: {
        ...bundlerArgs,
        type
      }
    })
  }

  const bundleConfigs = await api.applyPlugins({
    type: api.ApplyPluginsType.modify,
    key: 'modifyBundleConfigs',
    initialValue: [await getConfig({ type: BundlerConfigType.csr })].filter(
      Boolean
    ),
    args: {
      ...bundlerArgs,
      getConfig
    }
  })

  return {
    bundleImplementor,
    bundleConfigs,
    bundler
  }
}
