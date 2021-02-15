import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'ignoreMomentLocale',
    config: {
      default: true,
      schema(joi) {
        return joi.boolean()
      }
    }
  })
}
