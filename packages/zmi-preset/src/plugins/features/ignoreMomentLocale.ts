import { IApi } from '@zmi-cli/types'

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
