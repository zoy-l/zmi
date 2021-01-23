import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'headScripts',
    config: {
      schema(joi) {
        return joi.array()
      }
    }
  })
}
