import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'frameOptions',
    config: {
      schema(joi) {
        return joi.object()
      }
    }
  })
}
