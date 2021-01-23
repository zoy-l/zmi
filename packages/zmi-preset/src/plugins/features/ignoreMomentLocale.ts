import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'ignoreMomentLocale',
    config: {
      schema(joi) {
        return joi.boolean()
      }
    }
  })
}
