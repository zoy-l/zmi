import { Service as CoreService } from '@zmi/core'

export default class Service extends CoreService {
  constructor(opts: any) {
    super({
      ...opts,
      plugins: [require.resolve('@zmi/preset')]
    })
  }
}
