import { chalk, launchDevice } from '@lim/cli-utils'

launchDevice().then(() => {
  try {
    process.env.NODE_ENV = 'development'

    let closed = false

    process.once('SIGINT', () => onSignal('SIGINT'))

    process.once('SIGQUIT', () => onSignal('SIGQUIT'))

    process.once('SIGTERM', () => onSignal('SIGTERM'))

    function onSignal(signal: string) {
      process.exit(0)
    }
  } catch (e) {
    console.error(chalk.red(e.message))
    console.error(e.stack)
    process.exit(1)
  }
})
