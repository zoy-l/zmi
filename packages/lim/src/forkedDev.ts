import { chalk, launchDevice } from '../../lim-utils/lib'
import Service from './service'

launchDevice().then(({ args }) => {
  const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGQUIT', 'SIGTERM']
  try {
    process.env.NODE_ENV = 'development'
    debugger
    const service = new Service({})

    service.run({
      name: 'dev',
      args
    })

    let closed = false

    Signals.forEach((signal) => {
      process.once(signal, () => onSignal(signal))
    })

    function onSignal(signal: string) {
      process.exit(0)
    }
  } catch (e) {
    console.error(chalk.red(e.message))
    console.error(e.stack)
    process.exit(1)
  }
})
