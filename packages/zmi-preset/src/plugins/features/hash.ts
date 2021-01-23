import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'hash',
    config: {
      schema(joi) {
        return joi.boolean()
      }
    }
  })
}
