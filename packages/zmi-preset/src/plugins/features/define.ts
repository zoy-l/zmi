import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'define',
    config: {
      default: {},
      schema(joi) {
        return joi.object()
      }
    }
  })
}