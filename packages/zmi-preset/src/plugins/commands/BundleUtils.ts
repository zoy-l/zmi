import { Bundler as DefaultBundler } from '@zmi/webpack'

export async function getBundleAndConfigs(options: {
  api: any
  port?: number
}) {
  const { api, number } = options

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

  
}
