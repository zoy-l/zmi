import { IApi } from '@zmi-cli/types'
import { formatScripts } from '../common/htmlTools'

export default (api: IApi) => {
  api.describe({
    key: 'headScripts',
    config: {
      default: [],
      schema(joi) {
        return joi.array()
      }
    }
  })

  api.addHTMLHeadScripts(() => formatScripts(api.initConfig.headScripts))
}
