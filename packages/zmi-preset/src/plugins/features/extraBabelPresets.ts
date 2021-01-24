import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'extraBabelPresets',
    config: {
      default: [],
      schema(joi) {
        return joi.array()
      }
    }
  })
}
