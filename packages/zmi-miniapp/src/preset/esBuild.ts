import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'esBuild',
    config: {
      schema(joi) {
        return joi.boolean()
      }
    }
  })
}
