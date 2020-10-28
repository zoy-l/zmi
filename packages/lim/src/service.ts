import { Service as CoreService } from '@lim/core'

export default class Service extends CoreService {
  constructor(opts: any) {
    super({
      ...opts,
      presets: [require.resolve('@lim/preset')]
    })
  }
}
