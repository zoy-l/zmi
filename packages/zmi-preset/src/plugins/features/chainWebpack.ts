import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'chainWebpack',
    config: {
      schema(joi) {
        return joi.function()
      }
    }
  })
}
