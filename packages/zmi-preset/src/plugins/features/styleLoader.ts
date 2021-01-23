import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'styleLoader',
    config: {
      schema(joi) {
        return joi.object()
      }
    }
  })
}
