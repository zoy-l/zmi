import { launchDevice, chalk, dyo, clearConsole, isWin } from '@lim/cli-utils'
import readline from 'readline'
import fork from './utils/fork'

launchDevice(dyo).then(({ command }) => {
  const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']

  try {
    switch (command) {
      case 'dev':
        const child = fork({
          scriptPath: require.resolve('./forkedDev')
        })

        if (isWin) {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          })

          rl.on(Signals[0], () => {
            process.emit(Signals[0], Signals[0])
          })
        }

        Signals.forEach((SignalKey) => {
          process.on(SignalKey, () => {
            child.kill(SignalKey)
            process.exit(1)
          })
        })

        break
      default:
        clearConsole()

        if (command === 'build') {
          process.env.NODE_ENV = 'production'
        }
        break
    }
  } catch (err) {
    console.log(chalk.red(err.message))
    console.log(err.stack)
    process.exit(1)
  }
})
