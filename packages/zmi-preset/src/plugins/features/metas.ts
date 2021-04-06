import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'metas',
    config: {
      default: [],
      schema(joi) {
        return joi.array()
      }
    }
  })

  api.addHTMLMetas(() => api.initConfig.metas!)
}
