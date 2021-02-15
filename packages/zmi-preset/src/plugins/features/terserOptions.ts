import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'terserOptions',
    config: {
      default: {},
      schema(joi) {
        return joi.object()
      }
    }
  })
}
