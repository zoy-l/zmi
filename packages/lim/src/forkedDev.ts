import { chalk, launchDevice } from '@lim/cli-utils'

launchDevice().then(() => {
  const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGQUIT', 'SIGTERM']
  try {
    process.env.NODE_ENV = 'development'

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
