import { IApi } from '@zmi-cli/types'

export default function (api: IApi) {
  api.describe({
    key: 'autoCSSModules',
    config: {
      default: true,
      schema(joi) {
        return joi.boolean()
      }
    }
  })
}
