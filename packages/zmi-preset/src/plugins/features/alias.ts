import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'alias',
    config: {
      schema(joi) {
        return joi.object()
      }
    }
  })
}
