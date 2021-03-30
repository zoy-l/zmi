import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.registerCommand({
    command: 'dev',
    description: 'start dev server for development',
    async fn({ args }) {
      api.env = 'development'
      process.env.NODE_ENV = 'development'

      api.start({ command: 'webDev', args, reloadCommand: true })
    }
  })
}
