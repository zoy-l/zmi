import { IApi } from '@zmi-cli/types'

export default function (api: IApi) {
  api.describe({
    key: 'links',
    config: {
      default: [],
      schema(joi) {
        return joi.array()
      }
    }
  })

  api.addHTMLLinks(() => api.config.links)
}
