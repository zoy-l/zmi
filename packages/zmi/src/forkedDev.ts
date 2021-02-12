import { chalk, launchDevice } from '@zmi-cli/utils'

import { getCwd, getPkg } from './getRoot'
import Service from './service'

launchDevice().then(({ args }) => {
  const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGQUIT', 'SIGTERM']
  try {
    process.env.NODE_ENV = 'development'

    const service = new Service({
      cwd: getCwd(),
      pkg: getPkg(process.cwd())
    })

    service.run({
      command: 'dev',
      args
    })

    Signals.forEach((signal) => {
      process.once(signal, () => {
        service.applyPlugins({
          key: 'onExit',
          type: service.ApplyPluginsType.event,
          args: { signal }
        })
        process.exit(0)
      })
    })
  } catch (e) {
    console.error(chalk.red(e.message))
    console.error(e.stack)
    process.exit(1)
  }
})
