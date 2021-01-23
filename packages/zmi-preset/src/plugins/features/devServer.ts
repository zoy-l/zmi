import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'styleLoader',
    config: {
      default: {},
      schema(joi) {
        return joi.object()
      }
    }
  })
}
