import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'plugins',
    config: {
      default: [],
      schema(joi) {
        return joi.array()
      }
    }
  })
}
