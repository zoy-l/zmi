import { Service as CoreService } from '@lim/cli-core'

export default class Service extends CoreService {
  constructor(opts: any) {
    debugger

    super({
      ...opts,
      presets: [require.resolve('@lim/cli-preset')]
    })
  }
}
