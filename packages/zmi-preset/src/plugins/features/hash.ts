import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'hash',
    config: {
      default: true,
      schema(joi) {
        return joi.boolean()
      }
    }
  })
}
