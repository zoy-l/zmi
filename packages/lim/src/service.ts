import { Service as CoreService } from '../../lim-core/lib'
import { log } from 'console'

export default class Service extends CoreService {
  constructor(opts: any) {
    super({
      ...opts,
      presets: [require.resolve('@lim/cli-preset')]
    })
  }
}
