import { Service as CoreService } from '../../zmi-core/lib'

export default class Service extends CoreService {
  constructor(opts: any) {
    super({
      ...opts,
      plugins: [require.resolve('@zmi/preset')],
    })
  }
}
