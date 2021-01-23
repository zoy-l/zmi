import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'externals',
    config: {
      schema(joi) {
        return joi.object()
      }
    }
  })
}
