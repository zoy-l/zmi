import { join } from 'path'
import { chalk, getArgs } from '@lim/cli-utils'

const args = getArgs()

;(async () => {
  try {
    process.env.NODE_ENV = 'development'

    let closed = false
    // kill(2) Ctrl-C
    process.once('SIGINT', () => onSignal('SIGINT'))
    // kill(3) Ctrl-\
    process.once('SIGQUIT', () => onSignal('SIGQUIT'))
    // kill(15) default
    process.once('SIGTERM', () => onSignal('SIGTERM'))

    function onSignal(signal: string) {
      process.exit(0)
    }
  } catch (e) {
    console.error(chalk.red(e.message))
    console.error(e.stack)
    process.exit(1)
  }
})()
