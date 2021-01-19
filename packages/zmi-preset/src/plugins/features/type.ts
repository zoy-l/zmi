import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'type',
    config: {
      schema(joi) {
        return joi.string().valid('react', 'vue')
      }
    }
  })
}
