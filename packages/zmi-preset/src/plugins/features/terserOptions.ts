import { IApi } from '@zmi/types'

export default function (api: IApi) {
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
