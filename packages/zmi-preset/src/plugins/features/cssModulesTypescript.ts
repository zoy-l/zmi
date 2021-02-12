import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'cssModulesTypescript',
    config: {
      schema(joi) {
        return joi.object({
          mode: joi.string().valid('emit', 'verify').optional()
        })
      }
    }
  })
}
