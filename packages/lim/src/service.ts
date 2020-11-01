import { Service as CoreService } from '@lim/core'

export default class Service extends CoreService {
  constructor(opts: any) {
    super({
      ...opts,
      plugins: [require.resolve('@lim/preset')],
    })
  }
}
