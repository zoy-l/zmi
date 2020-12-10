import { chalk, launchDevice } from '@zmi/utils'
import Service from './service'

function onSignal(signal: string) {
  console.log(signal)
  process.exit(0)
}

launchDevice().then(({ args }) => {
  const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGQUIT', 'SIGTERM']
  try {
    process.env.NODE_ENV = 'development'

    const service = new Service({})

    service.run({
      command: 'dev',
      args
    })

    // let closed = false

    Signals.forEach((signal) => {
      process.once(signal, () => onSignal(signal))
    })
  } catch (e) {
    console.error(chalk.red(e.message))
    console.error(e.stack)
    process.exit(1)
  }
})
