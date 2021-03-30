import { IApi } from '@zmi-cli/types'

import { getBundleAndConfigs } from '../common/BundleUtils'

export default (api: IApi) => {
  api.registerCommand({
    command: 'build',
    description: 'build application production',
    async fn() {
      api.env = 'production'
      process.env.NODE_ENV = 'production'

      const { bundler, bundleConfigs } = await getBundleAndConfigs({ api })

      const { appOutputPath } = api.paths
      const stats = await bundler.build({
        bundleConfigs,
        appOutputPath
      })

      await api.applyEventHooks({
        key: 'onBuildComplete',
        args: { stats }
      })
    }
  })
}
