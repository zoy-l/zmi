import { launchDevice, chalk, dyo, clearConsole, isWin } from '@lim/utils'
import readline from 'readline'

import { getCwd, getPkg } from './utils/getRoot'
import fork from './utils/fork'
import Service from './service'

launchDevice(dyo).then(({ args, command }) => {
  debugger
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
        if (command === 'build') {
          process.env.NODE_ENV = 'production'
        }
        clearConsole()
        new Service({
          cwd: getCwd(),
          pkg: getPkg(process.cwd())
        }).run({
          command,
          args
        })
        break
    }
  } catch (err) {
    console.log(chalk.red(err.message))
    console.log(err.stack)
    process.exit(1)
  }
})
