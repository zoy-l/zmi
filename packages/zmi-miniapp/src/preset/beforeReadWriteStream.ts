import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'beforeReadWriteStream',
    config: {
      schema(joi) {
        return joi.func()
      }
    }
  })
}
