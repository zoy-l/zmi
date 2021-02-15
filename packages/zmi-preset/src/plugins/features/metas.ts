import { IApi } from '@zmi-cli/types'

export default function (api: IApi) {
  api.describe({
    key: 'metas',
    config: {
      default: [],
      schema(joi) {
        return joi.array()
      }
    }
  })

  api.addHTMLMetas(() => api.config.metas!)
}
