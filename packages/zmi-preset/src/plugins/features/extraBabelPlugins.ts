import { IApi } from '@zmi-cli/types'

export default function (api: IApi) {
  api.describe({
    key: 'extraBabelPlugins',
    config: {
      default: [],
      schema(joi) {
        return joi.array()
      }
    }
  })
}
