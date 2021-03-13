import { IApi } from '@zmi-cli/types'
import rename from 'gulp-rename'

import Nerd from 'zmi-nerd'

export default (api: IApi) => {
  api.registerCommand({
    name: 'miniapp',
    description: 'start miniApp dev server for development',
    async fn() {
      const nerd = new Nerd({
        customPrefix: 'miniApp',
        watch: true,
        userConfig: {
          output: 'miniprogram',
          ...(api.config ?? {}),
          afterReadWriteStream({ gulpIf }) {
            return gulpIf((file) => file.path.endsWith('.css'), rename({ extname: '.wxss' }))
          }
        }
      })

      await nerd.step()
    }
  })
}
