import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'extraBabelPresets',
    config: {
      schema(joi) {
        return joi.array().items(joi.any())
      }
    }
  })
}
