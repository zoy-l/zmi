import { Service as CoreService, IServiceOptions } from '@zmi/core'

export default class Service extends CoreService {
  constructor(opts: IServiceOptions) {
    super({
      ...opts,
      plugins: [require.resolve('@zmi/preset')]
    })
  }
}
