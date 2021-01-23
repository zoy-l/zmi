import { IApi } from '@zmi/types'

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
