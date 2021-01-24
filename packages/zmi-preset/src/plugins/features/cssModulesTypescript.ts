import { IApi } from '@zmi/types'

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
