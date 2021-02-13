import { IApi } from '@zmi-cli/types'

export default function (api: IApi) {
  api.describe({
    key: 'outputPath',
    config: {
      default: 'dist',
      schema(joi) {
        return joi.string()
      }
    }
  })
}
